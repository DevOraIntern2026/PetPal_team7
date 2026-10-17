const KEY = "petmate:session";

function parseDate(value) {
  return new Date(String(value).replace(/(\.\d{3})\d+/, "$1"));
}

function storageWithSession() {
  if (localStorage.getItem(KEY)) return localStorage;
  if (sessionStorage.getItem(KEY)) return sessionStorage;
  return null;
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
    const store = storageWithSession();
    const session = store ? JSON.parse(store.getItem(KEY)) : null;
    if (
      session?.refreshTokenExpiresAt &&
      parseDate(session.refreshTokenExpiresAt) <= new Date()
    ) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

// After a refresh: swap in the new tokens, keep the user and the storage type
export function updateTokens(tokens) {
  const store = storageWithSession();
  const session = readSession();
  if (!store || !session) return;
  const clean = Object.fromEntries(
    Object.entries(tokens).filter(([, v]) => v != null),
  );
  store.setItem(KEY, JSON.stringify({ ...session, ...clean }));
}
