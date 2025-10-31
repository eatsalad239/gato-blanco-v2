// Centralized error handling utility
export function handleError(error: unknown, context: string) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[${context}] Error:`, error);
  
  // You can add error reporting service here (e.g., Sentry)
  // if (import.meta.env.PROD) {
  //   reportError(error, context);
  // }
  
  return errorMessage;
}

export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageGet(key: string, fallback: string = ''): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

