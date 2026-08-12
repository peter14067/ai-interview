export function ChatPreviewMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-1.5 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs text-zinc-400">MockMate — 模擬面試中</span>
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            請分享一個你曾經優化前端效能的實際案例，你是如何找出瓶頸的？
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-brand to-accent px-4 py-2.5 text-sm text-white">
            我用 Chrome DevTools 的 Performance 面板抓出重複渲染的元件⋯
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            很好，那你後續是怎麼驗證優化真的有效的？
          </div>
        </div>
      </div>
    </div>
  );
}
