// Central API utility for consistent base URL handling

const API_BASE = import.meta.env.VITE_API_URL || '';

export function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
   let url = input;
   if (typeof input === 'string' && input.startsWith('/')) {
      url = API_BASE.replace(/\/$/, '') + input;
   }
   return fetch(url, init);
} 