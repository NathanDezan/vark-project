const BASE = import.meta.env.VITE_BACKEND_URL || "/svc/api";

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const detail = data?.detail || `HTTP ${res.status}`;
    throw new ApiError(detail, res.status, data);
  }
  return data;
}

export const api = {
  getQuestions: () => request("/questions"),
  getStatus: () => request("/status"),
  calculate: (payload) =>
    request("/score", { method: "POST", body: JSON.stringify(payload) }),
};

export { ApiError };
