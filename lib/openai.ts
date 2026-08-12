import OpenAI from "openai";

// BYOK（Bring Your Own Key）：不使用伺服器端的環境變數，改由使用者在前端輸入自己的 OpenAI API Key，
// 每個請求都用該使用者提供的 key 建立一個新的 client，key 不會被伺服器保存
export function createOpenAIClient(apiKey: string) {
  return new OpenAI({ apiKey });
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
