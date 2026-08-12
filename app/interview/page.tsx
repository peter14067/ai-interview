"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getStoredApiKey } from "@/lib/apiKey";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type QuestionFeedback = {
  question: string;
  yourAnswer: string;
  betterAnswer: string;
};

type Evaluation = {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  questionFeedback: QuestionFeedback[];
};

type Stage = "setup" | "interviewing" | "finished";

const DEFAULT_TOTAL_QUESTIONS = 3;
const MIN_TOTAL_QUESTIONS = 1;
const MAX_TOTAL_QUESTIONS = 10;

const primaryButton =
  "rounded-full bg-gradient-to-r from-brand to-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";
const card =
  "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900";
const fieldInput =
  "w-full resize-none rounded-xl border border-zinc-300 bg-white p-3 text-sm text-black outline-none transition-colors focus:border-brand dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(DEFAULT_TOTAL_QUESTIONS);
  const [stage, setStage] = useState<Stage>("setup");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answer, setAnswer] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // BYOK：從瀏覽器 localStorage 讀取使用者在「設定」頁面存的 OpenAI API Key
  const [apiKey, setApiKey] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, stage]);

  // 用 null 代表「還沒讀取」，空字串代表「讀取完成但沒有設定 Key」，避免畫面閃一下「未設定」的提示
  useEffect(() => {
    setApiKey(getStoredApiKey());
  }, []);

  async function callInterviewApi(history: ChatMessage[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, history, totalQuestions, apiKey }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "發生未知錯誤");
      }

      const data = await res.json();

      if (data.type === "question") {
        setMessages([...history, { role: "assistant", content: data.content }]);
        setQuestionNumber(data.questionNumber);
      } else if (data.type === "evaluation") {
        setEvaluation({
          score: data.score,
          strengths: data.strengths ?? [],
          improvements: data.improvements ?? [],
          summary: data.summary ?? "",
          questionFeedback: data.questionFeedback ?? [],
        });
        setStage("finished");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    if (!jobDescription.trim() || !apiKey?.trim()) return;
    setStage("interviewing");
    setMessages([]);
    setEvaluation(null);
    callInterviewApi([]);
  }

  function handleSubmitAnswer() {
    if (!answer.trim() || loading) return;
    const nextHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: answer },
    ];
    setMessages(nextHistory);
    setAnswer("");
    callInterviewApi(nextHistory);
  }

  function handleRestart() {
    setStage("setup");
    setJobDescription("");
    setTotalQuestions(DEFAULT_TOTAL_QUESTIONS);
    setMessages([]);
    setAnswer("");
    setQuestionNumber(0);
    setEvaluation(null);
    setError(null);
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand dark:bg-brand/15 dark:text-brand-light">
            MockMate
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl dark:text-zinc-50">
            AI 模擬面試
          </h1>
        </div>

        {stage === "setup" && apiKey !== null && !apiKey.trim() && (
          <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <p>開始之前，請先到「設定」頁面填入你自己的 OpenAI API Key。</p>
            <Link href="/settings" className="w-fit font-medium underline underline-offset-2">
              前往設定
            </Link>
          </div>
        )}

        {stage === "setup" && (
          <div className={`${card} flex flex-col gap-5`}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="job-description"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                職缺描述
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                placeholder="例如：資深前端工程師，需熟悉 React、TypeScript，負責電商平台的介面開發..."
                className={fieldInput}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="total-questions"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                題數（{MIN_TOTAL_QUESTIONS} ~ {MAX_TOTAL_QUESTIONS} 題）
              </label>
              <input
                id="total-questions"
                type="number"
                min={MIN_TOTAL_QUESTIONS}
                max={MAX_TOTAL_QUESTIONS}
                value={totalQuestions}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (Number.isNaN(value)) return;
                  setTotalQuestions(
                    Math.min(MAX_TOTAL_QUESTIONS, Math.max(MIN_TOTAL_QUESTIONS, value))
                  );
                }}
                className={`${fieldInput} w-24 resize-none`}
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!jobDescription.trim() || !apiKey?.trim() || loading}
              className={`${primaryButton} self-start`}
            >
              {loading ? "準備中..." : "開始模擬面試"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}

        {stage === "interviewing" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all"
                  style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                />
              </div>
              <p className="whitespace-nowrap text-xs font-medium text-zinc-500 dark:text-zinc-400">
                問題 {questionNumber} / {totalQuestions}
              </p>
            </div>

            <div className={`${card} flex flex-col gap-3`}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "assistant"
                        ? "rounded-tl-sm bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                        : "rounded-tr-sm bg-gradient-to-r from-brand to-accent text-white"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-400 dark:bg-zinc-800">
                    面試官思考中...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex flex-col gap-2">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitAnswer();
                  }
                }}
                rows={3}
                placeholder="輸入你的回答... (Enter 送出，Shift+Enter 換行)"
                disabled={loading}
                className={`${fieldInput} disabled:opacity-50`}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim() || loading}
                className={`${primaryButton} self-end`}
              >
                送出回答
              </button>
            </div>
          </div>
        )}

        {stage === "finished" && evaluation && (
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/10 to-accent/10 p-6 dark:border-brand/30">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                總分
              </p>
              <p className="mt-1 bg-gradient-to-r from-brand to-accent bg-clip-text text-5xl font-semibold text-transparent">
                {evaluation.score}
                <span className="text-lg font-normal text-zinc-400"> / 100</span>
              </p>
              <p className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {evaluation.summary}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className={card}>
                <p className="mb-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  表現優異之處
                </p>
                <ul className="list-inside list-disc space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className={card}>
                <p className="mb-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                  可以改進的地方
                </p>
                <ul className="list-inside list-disc space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                  {evaluation.improvements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {evaluation.questionFeedback.length > 0 && (
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  逐題回顧與更好的回答方式
                </p>
                {evaluation.questionFeedback.map((qf, i) => (
                  <div key={i} className={card}>
                    <p className="text-sm font-medium text-black dark:text-zinc-50">
                      第 {i + 1} 題：{qf.question}
                    </p>
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        你的回答
                      </p>
                      <p className="whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                        {qf.yourAnswer}
                      </p>
                    </div>
                    <div className="mt-3 space-y-1.5 rounded-xl bg-brand/5 p-3 dark:bg-brand/10">
                      <p className="text-xs font-medium text-brand dark:text-brand-light">
                        更好的回答方式
                      </p>
                      <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                        {qf.betterAnswer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleRestart}
              className="self-start rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-white/5"
            >
              重新開始
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
