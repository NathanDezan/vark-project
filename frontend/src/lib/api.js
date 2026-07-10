const BASE = import.meta.env.VITE_BACKEND_URL || "/svc/api";

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function parseJsonSafely(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseFilename(contentDisposition) {
  if (!contentDisposition) return "";
  const match = contentDisposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] || "";
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  const data = parseJsonSafely(text);
  if (!res.ok) {
    const detail = data?.detail || text || `HTTP ${res.status}`;
    throw new ApiError(detail, res.status, data);
  }
  return data;
}

async function requestFile(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    const data = parseJsonSafely(text);
    const detail = data?.detail || text || `HTTP ${res.status}`;
    throw new ApiError(detail, res.status, data);
  }
  return {
    blob: await res.blob(),
    filename: parseFilename(res.headers.get("content-disposition")),
  };
}

export const api = {
  getQuestions: () => request("/questions"),
  getStatus: () => request("/status"),
  calculate: (payload) =>
    request("/score", { method: "POST", body: JSON.stringify(payload) }),
  downloadResultPdf: (payload) =>
    requestFile("/result/pdf", { method: "POST", body: JSON.stringify(payload) }),
};

export { ApiError };
