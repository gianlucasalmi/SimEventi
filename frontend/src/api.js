const API_BASE_URL = process.env.REACT_APP_API_URL;

export const register = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/utenti/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return res.json();
};

export const login = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/utenti/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return res.json();
};

export const getEventi = async (token) => {
  const res = await fetch(`${API_BASE_URL}/eventi`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
