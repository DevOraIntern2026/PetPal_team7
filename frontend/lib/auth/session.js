const KEY = "petmate:session";

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {}
}

export function saveSession(session, remember = true) {
  if (typeof window === "undefined") return;
  try {
    clearSession();
    const str = JSON.stringify(session);
    localStorage.setItem(KEY, str);
    sessionStorage.setItem(KEY, str);
  } catch {}
}

export function readSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session && typeof session === "object" ? session : null;
  } catch {
    return null;
  }
}
