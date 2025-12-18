import { setAccessToken } from './api.js';

let bootstrapped = false;

export async function bootstrapAuth() {
   if (bootstrapped) return;
   bootstrapped = true;

   try {
      const res = await fetch('http://localhost:5000/api/auth/refresh', {
         method: 'POST',
         credentials: 'include',
      });

      if (!res.ok) return;

      const data = await res.json();
      setAccessToken(data.accessToken);

      console.info('Auth bootstrapped');
   } catch (err) {
      console.warn('Auth bootstrap failed');
   }
}
