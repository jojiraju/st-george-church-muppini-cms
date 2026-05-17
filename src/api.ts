export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('cms_token');
export const setToken = (t: string) => localStorage.setItem('cms_token', t);
export const clearToken = () => localStorage.removeItem('cms_token');

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const apiGet = async (path: string) => {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders() });
  return res.json();
};

export const apiPost = async (path: string, body: any, auth = true) => {
  const headers: any = { 'Content-Type': 'application/json' };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST', headers, body: JSON.stringify(body),
  });
  return res.json();
};

export const apiPut = async (path: string, body: any) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(body),
  });
  return res.json();
};

export const apiDelete = async (path: string) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE', headers: authHeaders(),
  });
  return res.json();
};

export const PERMISSION_LABELS: Record<string, string> = {
  view_dashboard:   'View Dashboard',
  view_families:    'View Families',
  manage_families:  'Manage Families',
  view_offerings:   'View Offerings',
  manage_offerings: 'Manage Offerings',
  view_contacts:    'View Contacts',
  manage_contacts:  'Manage Contacts',
  manage_users:     'Manage Users',
};

export const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS);
