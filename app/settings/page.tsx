"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredApiKey, setStoredApiKey } from "@/lib/apiKey";
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

type SaveState = "idle" | "saved" | "cleared";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    setApiKey(getStoredApiKey());
  }, []);

  function handleSave() {
    setStoredApiKey(apiKey);
    setSaveState("saved");
  }

  function handleClear() {
    setStoredApiKey("");
    setApiKey("");
    setSaveState("cleared");
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand dark:bg-brand/15 dark:text-brand-light">
            設定
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl dark:text-zinc-50">
            OpenAI API Key
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            MockMate 採用 BYOK（Bring Your Own Key）模式，使用你自己的 OpenAI API Key 呼叫模型。
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <label
            htmlFor="api-key"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            你的 OpenAI API Key
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setSaveState("idle");
              }}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-zinc-300 bg-white p-3 font-mono text-sm text-black outline-none transition-colors focus:border-brand dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? "隱藏 API Key" : "顯示 API Key"}
              className="flex shrink-0 items-center justify-center rounded-xl border border-zinc-300 px-3 text-zinc-500 transition-colors hover:text-black dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white"
            >
              {showKey ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="rounded-full bg-gradient-to-r from-brand to-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              儲存
            </button>
            <button
              onClick={handleClear}
              className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/5 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              清除
            </button>
            {saveState === "saved" && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                已儲存
              </span>
            )}
            {saveState === "cleared" && (
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                已清除
              </span>
            )}
          </div>

          <p className="mt-5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            這組 Key 只會儲存在你目前這台瀏覽器的 localStorage，不會被上傳或保存在 MockMate 的伺服器上；
            每次模擬面試時會隨請求一起送到我們的 API，由伺服器即時轉發給 OpenAI，不會另外記錄。
            <br />
            還沒有 API Key？可以到{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline dark:text-brand-light"
            >
              platform.openai.com/api-keys
            </a>{" "}
            申請。
          </p>
        </div>

        <Link
          href="/interview"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline dark:text-brand-light"
        >
          前往開始模擬面試
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}
