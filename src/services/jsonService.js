// src/services/jsonService.js
const API_BASE = 'http://localhost:3001';

// --- Articles ---
export const getArticles = async () => {
    const response = await fetch(`${API_BASE}/articles`);
    return response.json();
};

export const addArticle = async (article) => {
    const response = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    });
    return response.json();
};

export const updateArticle = async (id, article) => {
    const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    });
    return response.json();
};

export const deleteArticle = async (id) => {
    await fetch(`${API_BASE}/articles/${id}`, { method: 'DELETE' });
};

// --- Categories ---
export const getCategories = async () => {
    const response = await fetch(`${API_BASE}/categories`);
    return response.json();
};

export const addCategory = async (category) => {
    const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });
    return response.json();
};

export const updateCategory = async (id, category) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });
    return response.json();
};

export const deleteCategory = async (id) => {
    await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
};

// --- Parametres Globaux ---
export const getParametres = async () => {
    const response = await fetch(`${API_BASE}/parametres`);
    const data = await response.json();
    return data[0] || {};
};

export const updateParametres = async (id, params) => {
    const response = await fetch(`${API_BASE}/parametres/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });
    return response.json();
};