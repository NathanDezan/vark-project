const memoryStorage = (() => {
  const entries = new Map();

  return {
    getItem(key) {
      return entries.has(key) ? entries.get(key) : null;
    },
    setItem(key, value) {
      entries.set(String(key), String(value));
    },
    removeItem(key) {
      entries.delete(String(key));
    },
    clear() {
      entries.clear();
    },
  };
})();

export function getSafeSessionStorage() {
  if (typeof window === "undefined") {
    return memoryStorage;
  }

  try {
    const { sessionStorage } = window;
    const probeKey = "__vark_storage_probe__";
    sessionStorage.setItem(probeKey, "1");
    sessionStorage.removeItem(probeKey);
    return sessionStorage;
  } catch {
    return memoryStorage;
  }
}
