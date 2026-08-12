// BYOK：OpenAI API Key 只存在使用者瀏覽器的 localStorage，不會上傳到我們的伺服器保存
// 每次呼叫 /api/interview 時才會把它當成一般的 request body 欄位夾帶過去，由伺服器即時轉發給 OpenAI
export const API_KEY_STORAGE_KEY = "mockmate_openai_api_key";

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
}

export function setStoredApiKey(apiKey: string) {
  if (typeof window === "undefined") return;
  const trimmed = apiKey.trim();
  if (trimmed) {
    window.localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
  } else {
    window.localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}
