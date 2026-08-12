import { NextRequest, NextResponse } from "next/server";
import { createOpenAIClient, OPENAI_MODEL } from "@/lib/openai";

// 沒有指定題數時的預設題數
const DEFAULT_TOTAL_QUESTIONS = 3;
// 題數輸入的合法範圍，避免使用者傳入 0 題或誇張的題數（例如 999 題）
const MIN_TOTAL_QUESTIONS = 1;
const MAX_TOTAL_QUESTIONS = 10;

// 一則對話紀錄：assistant = 面試官問的題目，user = 使用者的回答
// 這個型別剛好對應 OpenAI Chat API 需要的 message 格式，可以直接展開丟給 openai.chat.completions.create
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// 前端呼叫這支 API 時，request body 解析成功後的形狀
type RequestBody = {
  jobDescription: string; // 職缺描述，用來讓 AI 扮演這個職缺的面試官
  history: ChatMessage[]; // 到目前為止的完整對話紀錄（不含 system prompt）
  totalQuestions: number; // 使用者設定要問幾題
  apiKey: string; // BYOK：使用者自己輸入的 OpenAI API Key，伺服器不保存
};

// type guard：檢查一個不明的值是否符合 ChatMessage 的形狀
// 因為 request body 是 JSON.parse 出來的 unknown，TypeScript 不會自動信任它的結構，要手動驗證
function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string"
  );
}

// 驗證並解析前端傳來的 request body
// 回傳 null 代表格式不合法，呼叫端會直接回 400 錯誤
function parseBody(body: unknown): RequestBody | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  // jobDescription 必須是非空字串
  if (typeof b.jobDescription !== "string" || !b.jobDescription.trim()) {
    return null;
  }

  // apiKey 必須是非空字串（BYOK，由使用者自行輸入）
  if (typeof b.apiKey !== "string" || !b.apiKey.trim()) {
    return null;
  }

  // history 必須是陣列，且每一個元素都要通過 isChatMessage 驗證
  if (!Array.isArray(b.history) || !b.history.every(isChatMessage)) {
    return null;
  }

  // totalQuestions 是可選欄位：沒帶就用預設值 3；有帶就必須是整數，
  // 並且會被夾在 [MIN_TOTAL_QUESTIONS, MAX_TOTAL_QUESTIONS] 範圍內（防止使用者亂傳誇張數字）
  let totalQuestions = DEFAULT_TOTAL_QUESTIONS;
  if (b.totalQuestions !== undefined) {
    if (typeof b.totalQuestions !== "number" || !Number.isInteger(b.totalQuestions)) {
      return null;
    }
    totalQuestions = Math.min(
      MAX_TOTAL_QUESTIONS,
      Math.max(MIN_TOTAL_QUESTIONS, b.totalQuestions)
    );
  }

  return {
    jobDescription: b.jobDescription,
    history: b.history,
    totalQuestions,
    apiKey: b.apiKey.trim(),
  };
}

// 請 AI 扮演面試官，根據職缺描述 + 目前的對話紀錄，出下一題
// questionNumber：這是第幾題（從 1 開始），純粹用來塞進 prompt 讓 AI 知道進度，也回傳給前端顯示「問題 X / Y」
async function askQuestion(
  apiKey: string,
  jobDescription: string,
  history: ChatMessage[],
  questionNumber: number,
  totalQuestions: number
) {
  const openai = createOpenAIClient(apiKey);

  // system prompt：設定 AI 的角色、任務、以及輸出格式的限制
  // 特別要求「只輸出問題本身」，避免 AI 加上「好的，第一題是...」這類多餘前綴
  const systemPrompt = `你是一位專業的技術面試官，正在對應徵「${jobDescription}」職位的求職者進行模擬面試。
根據職缺描述與先前的對話，提出下一個面試問題。
這是總共 ${totalQuestions} 題中的第 ${questionNumber} 題。
問題要精簡、聚焦於這個職缺所需的技能與經驗，且不要重複先前問過的問題。
只輸出問題本身的文字，不要加上編號、前綴、引號或其他說明。`;

  // 把 system prompt 放在最前面，後面接上目前為止的對話紀錄（過去問過的題目 + 使用者的回答）
  // 這樣 AI 才能參考前面問過什麼，不會重複出題，也能根據回答追問
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.8, // 出題希望有點變化性，temperature 設高一點
    messages: [{ role: "system", content: systemPrompt }, ...history],
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI 未回傳問題內容");
  }

  // 回傳給前端：type 用來讓前端判斷這是「新題目」還是「最終評分」
  return NextResponse.json({
    type: "question" as const,
    content,
    questionNumber,
    totalQuestions,
  });
}

// 面試全部題目問完（使用者也都回答完）之後，請 AI 根據完整對話紀錄做總評
async function evaluateInterview(
  apiKey: string,
  jobDescription: string,
  history: ChatMessage[],
  totalQuestions: number
) {
  const openai = createOpenAIClient(apiKey);

  // 把對話紀錄拆成「AI 問的題目」跟「使用者的回答」兩個陣列
  // 因為對話是一問一答交替出現，所以 questions[i] 對應的答案就是 answers[i]
  const questions = history
    .filter((m) => m.role === "assistant")
    .map((m) => m.content);
  const answers = history.filter((m) => m.role === "user").map((m) => m.content);

  // system prompt 要求 AI 用「純 JSON」回覆，並且明確定義每個欄位的意義
  // betterAnswers 特別要求要跟 questions 陣列同樣長度、同樣順序，方便後面用 index 一一對應
  const systemPrompt = `你是一位專業的技術面試官，剛對應徵「${jobDescription}」職位的求職者完成了 ${totalQuestions} 題模擬面試。
請根據完整的對話紀錄，給出評分與建議。
請以下列 JSON 格式回覆，且只輸出 JSON，不要加上其他文字或 markdown 標記：
{
  "score": 0 到 100 之間的整數，代表整體面試表現分數,
  "strengths": ["求職者表現優異之處，2 到 4 點"],
  "improvements": ["可以改進的地方，2 到 4 點"],
  "summary": "2 到 3 句話的整體評語",
  "betterAnswers": ["針對每一題，依照提問順序，給出一個更好的回答範例，長度共 ${questions.length} 個字串，順序需與提問順序一致"]
}`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.5, // 評分希望穩定一致，temperature 比出題時低
    // 強制 OpenAI 回傳合法的 JSON 字串，省去自己用 regex 從文字裡挖 JSON 的麻煩
    response_format: { type: "json_object" },
    messages: [{ role: "system", content: systemPrompt }, ...history],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI 未回傳評分內容");
  }

  // response_format 只保證「是合法 JSON」，不保證欄位一定存在或型別正確，
  // 所以底下組 questionFeedback 時仍然要做防呆（Array.isArray / typeof 檢查）
  const parsed = JSON.parse(content);
  const betterAnswers: unknown[] = Array.isArray(parsed.betterAnswers)
    ? parsed.betterAnswers
    : [];

  // 用「題目本身（server 端已知，最可靠）」當作基準，
  // 把每一題的題目、使用者的回答、AI 建議的更好回答組成一筆 questionFeedback
  // 這樣即使 AI 回傳的 betterAnswers 數量不夠或型別不對，也只會讓該筆的 betterAnswer 變空字串，不會整支 API 壞掉
  const questionFeedback = questions.map((question, i) => ({
    question,
    yourAnswer: answers[i] ?? "",
    betterAnswer:
      typeof betterAnswers[i] === "string" ? betterAnswers[i] : "",
  }));

  return NextResponse.json({
    type: "evaluation" as const,
    score: parsed.score,
    strengths: parsed.strengths,
    improvements: parsed.improvements,
    summary: parsed.summary,
    questionFeedback,
  });
}

// Next.js App Router 的路由處理函式：POST /api/interview
// 這支 API 是「無狀態」的 —— 每次呼叫都要帶上完整的 jobDescription + history，
// server 端不會保存任何對話紀錄，靠 history 的長度來判斷目前面試進行到哪個階段
export async function POST(req: NextRequest) {
  // 先確認 body 是合法的 JSON，避免 req.json() 在解析失敗時直接丟出未捕捉的例外
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "無效的 JSON" }, { status: 400 });
  }

  // 再驗證 JSON 的內容形狀是否符合 RequestBody
  const body = parseBody(json);
  if (!body) {
    return NextResponse.json(
      { error: "缺少 jobDescription、apiKey，或 history/totalQuestions 格式錯誤" },
      { status: 400 }
    );
  }

  const { jobDescription, history, totalQuestions, apiKey } = body;

  // 核心邏輯：用「history 裡 assistant 訊息的數量」代表「目前已經問過幾題」
  // - 第一次呼叫：history 是空陣列 → assistantQuestionCount = 0 → 出第 1 題
  // - 使用者回答完第 N 題後，前端會把新的 user 訊息加進 history 再打一次 API
  //   這時 assistantQuestionCount 還是 N（還沒新增下一題的 assistant 訊息）
  //   若 N < totalQuestions → 繼續出下一題（第 N+1 題）
  //   若 N >= totalQuestions → 代表所有題目都問完且回答完了 → 進入評分階段
  const assistantQuestionCount = history.filter(
    (m) => m.role === "assistant"
  ).length;

  try {
    if (assistantQuestionCount >= totalQuestions) {
      return await evaluateInterview(apiKey, jobDescription, history, totalQuestions);
    }
    return await askQuestion(
      apiKey,
      jobDescription,
      history,
      assistantQuestionCount + 1,
      totalQuestions
    );
  } catch (error) {
    // 統一捕捉 OpenAI API 呼叫失敗（額度用完、網路錯誤、JSON.parse 失敗等）
    console.error("Interview API error:", error);

    // OpenAI SDK 的錯誤物件會帶 status（例如 401 = API Key 無效、429 = 額度用盡）
    // 針對這類使用者可自行排除的錯誤，回傳更明確的訊息，而不是統一的「發生錯誤」
    const status =
      error && typeof error === "object" && "status" in error
        ? (error as { status?: unknown }).status
        : undefined;

    if (status === 401) {
      return NextResponse.json(
        { error: "OpenAI API Key 無效，請到「設定」重新確認你的 Key" },
        { status: 401 }
      );
    }
    if (status === 429) {
      return NextResponse.json(
        { error: "OpenAI API 額度已用盡或請求過於頻繁，請稍後再試" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "呼叫 OpenAI API 時發生錯誤" },
      { status: 500 }
    );
  }
}
