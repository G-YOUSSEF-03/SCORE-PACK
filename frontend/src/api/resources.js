import { api } from './client.js'

const unwrap = (response) => response.data.data

export const publicApi = {
  services: () => api.get('/services').then(unwrap),
  serviceDetails: (slug) => api.get(`/public/services/${slug}`).then(unwrap),
  projects: () => api.get('/public/projects').then(unwrap),
  news: () => api.get('/public/news').then(unwrap),
  newsDetails: (slug) => api.get(`/public/news/${slug}`).then(unwrap),
  settings: () => api.get('/public/settings').then(unwrap),
  quoteRequest: (payload) => api.post('/quote-requests', payload).then(unwrap),
  contactMessage: (payload) => api.post('/contact/messages', payload).then(unwrap),
}

export const dashboardApi = {
  get: () => api.get('/admin/dashboard').then(unwrap),
}

export const servicesApi = {
  list: () => api.get('/admin/services').then(unwrap),
  create: (payload) => api.post('/admin/services', payload).then(unwrap),
  update: (id, payload) => api.put(`/admin/services/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/admin/services/${id}`),
}

export const projectsApi = {
  list: () => api.get('/admin/projects').then(unwrap),
  show: (id) => api.get(`/admin/projects/${id}`).then(unwrap),
  create: (payload) => api.post('/admin/projects', payload, multipartConfig()).then(unwrap),
  update: (id, payload) => api.post(`/admin/projects/${id}?_method=PUT`, payload, multipartConfig()).then(unwrap),
  remove: (id) => api.delete(`/admin/projects/${id}`),
}

export const newsApi = {
  list: () => api.get('/admin/news').then(unwrap),
  create: (payload) => api.post('/admin/news', payload, multipartConfig()).then(unwrap),
  update: (id, payload) => api.post(`/admin/news/${id}?_method=PUT`, payload, multipartConfig()).then(unwrap),
  remove: (id) => api.delete(`/admin/news/${id}`),
}

export const adminSettingsApi = {
  get: () => api.get('/admin/settings').then(unwrap),
  update: (payload) => api.post('/admin/settings?_method=PATCH', payload, multipartConfig()).then(unwrap),
}

export const quotesApi = {
  list: (params = {}) => api.get('/admin/quote-requests', { params }).then(unwrap),
  show: (id) => api.get(`/admin/quote-requests/${id}`).then(unwrap),
  update: (id, payload) => api.patch(`/admin/quote-requests/${id}`, payload).then(unwrap),
  markRead: (id) => api.patch(`/admin/quote-requests/${id}/read`).then(unwrap),
  updateStatus: (id, status) => api.patch(`/admin/quote-requests/${id}/status`, { status }).then(unwrap),
  reply: (id, payload) => api.post(`/admin/quote-requests/${id}/reply`, payload),
  remove: (id) => api.delete(`/admin/quote-requests/${id}`),
}

export const messagesApi = {
  list: () => api.get('/admin/contact-messages').then((response) => response.data),
  show: (id) => api.get(`/admin/contact-messages/${id}`).then(unwrap),
  markRead: (id) => api.patch(`/admin/contact-messages/${id}/read`).then(unwrap),
  reply: (id, payload) => api.post(`/admin/contact-messages/${id}/reply`, payload),
  remove: (id) => api.delete(`/admin/contact-messages/${id}`),
}

export const usersApi = {
  list: (params = {}) => api.get('/admin/users', { params }).then(unwrap),
  show: (id) => api.get(`/admin/users/${id}`).then(unwrap),
  create: (payload) => api.post('/admin/users', payload).then(unwrap),
  update: (id, payload) => api.put(`/admin/users/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/admin/users/${id}`),
}

function multipartConfig() {
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
}
