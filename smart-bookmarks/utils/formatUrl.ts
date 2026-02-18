export function formatUrl(url: string): string {
  // Remove protocol if present
  let formatted = url.replace(/^https?:\/\//, '');
  
  // Remove www. if present
  formatted = formatted.replace(/^www\./, '');
  
  // Remove trailing slash
  formatted = formatted.replace(/\/$/, '');
  
  // Truncate if too long
  if (formatted.length > 50) {
    formatted = formatted.substring(0, 47) + '...';
  }
  
  return formatted;
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function addProtocol(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}