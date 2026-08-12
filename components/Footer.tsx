import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent text-xs font-bold text-white">
                M
              </span>
              <span className="text-sm font-semibold text-black dark:text-white">
                MockMate
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              由 AI 驅動的模擬面試教練，貼上職缺描述即可開始練習，幫助你在正式面試前建立信心。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-2">
            <div>
              <p className="font-medium text-black dark:text-white">產品</p>
              <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-400">
                <li>
                  <Link href="/#features" className="hover:text-black dark:hover:text-white">
                    產品特色
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-black dark:hover:text-white">
                    使用方式
                  </Link>
                </li>
                <li>
                  <Link href="/interview" className="hover:text-black dark:hover:text-white">
                    開始面試
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-black dark:text-white">關於</p>
              <ul className="mt-3 space-y-2 text-zinc-500 dark:text-zinc-400">
                <li>
                  <Link href="/#faq" className="hover:text-black dark:hover:text-white">
                    常見問題
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-black/5 pt-6 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <p>© {year} MockMate. All rights reserved.</p>
          <p>由 OpenAI API 驅動</p>
        </div>
      </div>
    </footer>
  );
}
