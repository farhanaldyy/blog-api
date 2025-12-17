import { api } from '../utils/api.js';
const URI_API = 'http://localhost:5000/api/user';

// read profile
async function readProfile() {
   try {
      const res = await api(`${URI_API}/`, {
         method: 'GET',
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
         message: `Error: ${err.message}`,
      };
   }
}

export { readProfile };
