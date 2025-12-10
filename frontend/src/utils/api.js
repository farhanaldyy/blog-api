let accessToken = null;

export function setAccessToken(token) {
   accessToken = token;
}

export async function api(url, options = {}) {
   console.log(accessToken);

   const isFormData = options.body instanceof FormData;

   const res = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
         ...(isFormData ? {} : options.headers),
         Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
   });

   // if access token expired
   if (res.status === 401) {
      console.log('Access token expired, trying to refresh...');

      // call refresh
      const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', {
         method: 'POST',
         credentials: 'include',
      });

      if (refreshRes.ok) {
         const refreshData = await refreshRes.json();
         accessToken = refreshData.accesstoken; //update token lokal

         console.log('Token refreshed: ', accessToken);

         // retry original request
         return fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
               ...(isFormData ? {} : options.headers),
               Authorization: `Bearer ${accessToken}`,
            },
         });
      }
   }

   return res;
}
