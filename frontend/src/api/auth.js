import { api, setAccessToken } from '../utils/api.js';
const URI_API = 'http://localhost:5000/api/auth';

async function register(uname, email, password, role) {
   try {
      const res = await fetch(`${URI_API}/register`, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify({
            name: uname,
            email: email,
            password: password,
            role: role,
         }),
      });

      const data = await res.json().catch(() => ({}));

      return {
         ok: res.ok,
         ...data,
      };
   } catch (err) {
      return {
         ok: false,
         message: `Server error: ${err.message}`,
      };
   }
}

async function login(email, password) {
   try {
      const res = await fetch(`${URI_API}/login`, {
         method: 'POST',
         credentials: 'include',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify({
            email: email,
            password: password,
         }),
      });

      const data = await res.json().catch(() => ({}));

      setAccessToken(data.accessToken);

      return {
         ok: res.ok,
         ...data,
      };
   } catch (err) {
      return {
         ok: false,
         message: `Server error: ${err.message}`,
      };
   }
}

async function logout() {
   try {
      const res = await fetch(`${URI_API}/logout`, {
         method: 'POST',
         credentials: 'include',
         headers: {
            'Content-type': 'application/json',
         },
      });

      const data = await res.json().catch(() => ({}));

      return {
         ok: res.ok,
         ...data,
      };
   } catch (err) {
      return {
         ok: false,
         message: `Server error: ${err.message}`,
      };
   }
}

async function profile() {
   try {
      const res = await api(`${URI_API}/profile`, {
         method: 'GET',
         credentials: 'include',
         headers: {
            'Content-type': 'application/json',
         },
      });

      const data = await res.json().catch(() => ({}));

      return {
         ok: res.ok,
         ...data,
      };
   } catch (err) {
      return {
         ok: false,
         message: `Server error: ${err.message}`,
      };
   }
}

export { login, register, logout, profile };
