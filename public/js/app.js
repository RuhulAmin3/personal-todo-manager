const API = {
  signup: '/api/auth/signup',
  login: '/api/auth/login',
  profile: '/api/auth/profile',
  logout: '/api/auth/logout',
  todos: '/api/todos',
};

const getToken = () => window.localStorage.getItem('token');
const setToken = (t) => window.localStorage.setItem('token', t);
const clearToken = () => window.localStorage.removeItem('token');

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

async function apiGet(url) {
  const res = await fetch(url, { headers: authHeader() });
  return res.json();
}
async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  });
  return res.json();
}
async function apiPut(url, body) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  });
  return res.json();
}
async function apiDelete(url) {
  const res = await fetch(url, { method: 'DELETE', headers: authHeader() });
  return res.json();
}

// Auth pages
window.handleSignup = async (e) => {
  e.preventDefault();
  const username = document.querySelector('#signup-username').value.trim();
  const password = document.querySelector('#signup-password').value;
  const data = await apiPost(API.signup, { username, password });
  const msg = document.querySelector('#signup-msg');
  if (data.success) {
    setToken(data.token);
    window.location.href = '/dashboard';
  } else {
    msg.textContent = data.message || 'Signup failed';
  }
};

window.handleLogin = async (e) => {
  e.preventDefault();
  const username = document.querySelector('#login-username').value.trim();
  const password = document.querySelector('#login-password').value;
  const data = await apiPost(API.login, { username, password });
  const msg = document.querySelector('#login-msg');
  if (data.success) {
    setToken(data.token);
    window.location.href = '/dashboard';
  } else {
    msg.textContent = data.message || 'Login failed';
  }
};

window.handleLogout = async () => {
  const data = await apiPost(API.logout, {});
  clearToken();
  window.location.href = '/';
};

// Dashboard
async function loadTodos() {
  const list = document.querySelector('#todo-list');
  const empty = document.querySelector('#todo-empty');
  if (!getToken()) {
    window.location.href = '/login';
    return;
  }
  const data = await apiGet(API.todos);
  list.innerHTML = '';
  if (!data.success || !data.todos || data.todos.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  data.todos.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <div>
        <strong>${t.text}</strong>
        <span class="badge ${t.completed ? 'badge-success' : 'badge-muted'}">${t.completed ? 'Done' : 'Pending'}</span>
      </div>
      <div class="actions">
        <button class="btn btn-outline" onclick="toggleComplete('${t.id}', ${!t.completed})">${t.completed ? 'Mark Pending' : 'Mark Done'}</button>
        <button class="btn btn-outline" onclick="editTodoPrompt('${t.id}', '${t.text.replace(/"/g, '&quot;')}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteTodo('${t.id}')">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const onDashboard = document.body.dataset.page === 'dashboard';
  const onProfile = document.body.dataset.page === 'profile';
  if (onDashboard) {
    loadTodos();
  }
  if (onProfile) {
    loadProfile();
  }
});

window.createTodo = async (e) => {
  e.preventDefault();
  const input = document.querySelector('#todo-input');
  const text = input.value.trim();
  if (!text) return;
  const data = await apiPost(API.todos, { text });
  if (data.success) {
    input.value = '';
    loadTodos();
  }
};

window.toggleComplete = async (id, completed) => {
  const data = await apiPut(`${API.todos}/${id}`, { completed });
  if (data.success) loadTodos();
};

window.editTodoPrompt = async (id, currentText) => {
  const text = window.prompt('Edit todo', currentText);
  if (text && text.trim()) {
    const data = await apiPut(`${API.todos}/${id}`, { text });
    if (data.success) loadTodos();
  }
};

window.deleteTodo = async (id) => {
  const data = await apiDelete(`${API.todos}/${id}`);
  if (data.success) loadTodos();
};

async function loadProfile() {
  if (!getToken()) {
    window.location.href = '/login';
    return;
  }
  const data = await apiGet(API.profile);
  const el = document.querySelector('#profile');
  if (data.success) {
    el.innerHTML = `<div class="card"><div class="title">@${data.user.username}</div><div class="muted">User ID: ${data.user.id}</div></div>`;
  }
}