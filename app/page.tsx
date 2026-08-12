import Link from "next/link";
import { ChatPreviewMock } from "@/components/ChatPreviewMock";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  ChartIcon,
  ChatIcon,
  LightbulbIcon,
  SparkleIcon,
} from "@/components/icons";

const useCases = ["前端工程師", "後端工程師", "產品經理", "資料分析師", "UI/UX 設計師"];

const features = [
  {
    icon: BriefcaseIcon,
    title: "根據職缺客製化出題",
    description: "貼上任何職缺描述，AI 面試官會扮演該職缺的角色，問出真正對應職能的問題。",
  },
  {
    icon: ChatIcon,
    title: "多輪追問，像真人面試官",
    description: "AI 會參考你前面的回答持續追問，模擬真實面試的臨場感，而不是單純的固定題庫。",
  },
  {
    icon: ChartIcon,
    title: "結構化評分與建議",
    description: "面試結束後給出總分、表現優異之處與可以改進的地方，一目瞭然。",
  },
  {
    icon: LightbulbIcon,
    title: "逐題「更好的回答」示範",
    description: "針對你答過的每一題，AI 會示範一個更好的回答方式，讓你知道差距在哪裡。",
  },
];

const steps = [
  {
    number: "1",
    title: "貼上職缺描述",
    description: "把你想練習的職缺 JD 貼上，並選擇想要練習的題數。",
  },
  {
    number: "2",
    title: "回答 AI 面試官的提問",
    description: "AI 會依序出題，並根據你的回答繼續追問，就像真的面試一樣。",
  },
  {
    number: "3",
    title: "取得評分與改進建議",
    description: "面試結束後立即拿到總分、優缺點分析，以及每題的更好回答示範。",
  },
];

const faqs = [
  {
    question: "這個工具會保存我的面試紀錄嗎？",
    answer: "不會。每次面試都是即時進行，關閉頁面或重新開始後，對話紀錄不會被保留。",
  },
  {
    question: "可以練習任何職缺嗎？",
    answer: "可以，只要貼上職缺描述，AI 面試官就會依據內容出題，不限特定產業或職能。",
  },
  {
    question: "題數可以自己調整嗎？",
    answer: "可以，開始面試前可以自訂想要練習的題數，最少 1 題、最多 10 題。",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl dark:bg-brand/25" />
          <div className="absolute -top-10 right-0 h-[24rem] w-[24rem] rounded-full bg-accent/20 blur-3xl dark:bg-accent/20" />
        </div>

        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-medium text-brand dark:border-brand-light/30 dark:bg-brand/10 dark:text-brand-light">
            <SparkleIcon className="h-4 w-4" />
            AI 驅動的模擬面試教練
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-black sm:text-5xl md:text-6xl dark:text-white">
            在正式面試前，
            <br className="hidden sm:block" />
            先跟{" "}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              AI 面試官
            </span>{" "}
            練一輪
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
            貼上任何一則職缺描述，MockMate 會化身該職缺的面試官，即時出題、追問，並在結束後給你評分與逐題的更好回答示範。
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-transform hover:scale-[1.03]"
            >
              免費開始模擬面試
              <ArrowRightIcon />
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border border-zinc-300 px-8 py-3.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-black/5 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/5"
            >
              了解運作方式
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
            <span>適用於</span>
            {useCases.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-16 w-full max-w-3xl">
            <ChatPreviewMock />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-white">
            不只是題庫，是會思考的面試官
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            每一個環節都是為了讓你更貼近真實面試的樣子。
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-black/5 bg-zinc-50 py-24 dark:border-white/10 dark:bg-zinc-950"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-white">
              三個步驟，開始練習
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              不需要註冊，也不需要設定，貼上職缺描述就能立刻開始。
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-sm font-semibold text-white">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="pointer-events-none absolute top-5 left-[calc(50%+2.75rem)] hidden h-px w-[calc(100%-5.5rem)] bg-gradient-to-r from-brand/40 to-transparent sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-white">
          常見問題
        </h2>

        <div className="mt-12 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-black marker:content-none dark:text-white">
                {faq.question}
                <span className="ml-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-accent px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 40%)",
            }}
          />
          <h2 className="relative text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            準備好練一場面試了嗎？
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            現在就貼上職缺描述，讓 AI 面試官陪你把答案打磨得更漂亮。
          </p>
          <Link
            href="/interview"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-[1.03]"
          >
            免費開始模擬面試
            <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </div>
  );
}
