const API_BASE_URL = '/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('codemorph_auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired or invalid
    localStorage.removeItem('codemorph_auth_token');
    localStorage.removeItem('codemorph_user');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'An error occurred during API request.');
  }

  return data as T;
}
