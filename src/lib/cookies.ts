export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

export function setCookie(name: string, value: string, maxAge?: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  const cookieParts = [`${name}=${value}`, 'path=/'];

  if (maxAge) {
    cookieParts.push(`max-age=${maxAge}`);
  }

  // We need to use direct assignment for cookies to work properly
  // biome-ignore lint/suspicious/noDocumentCookie: Required for cookie functionality
  document.cookie = cookieParts.join('; ');
}

export function parseCookieValue(value: string | null): boolean {
  return value === 'true';
}
