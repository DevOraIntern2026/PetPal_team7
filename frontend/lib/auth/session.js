const KEY = "petmate:session";

function parseDate(value) {
  return new Date(String(value).replace(/(\.\d{3})\d+/, "$1"));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}

export function saveSession(session, remember = true) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(
    KEY,
    JSON.stringify(session),
  );
}

export function readSession() {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    const session = raw ? JSON.parse(raw) : null;
    if (session?.expiresAt && parseDate(session.expiresAt) <= new Date()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}
