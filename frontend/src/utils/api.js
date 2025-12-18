let accessToken = null;
let isRefreshing = false;

export function setAccessToken(token) {
   accessToken = token;
}

// update for gpt recomend
// export async function api(url, options = {}) {
//    // console.log(accessToken);

//    const isFormData = options.body instanceof FormData;

//    const res = await fetch(url, {
//       credentials: 'include',
//       ...options,
//       headers: {
//          ...(isFormData ? {} : options.headers),
//          Authorization: accessToken ? `Bearer ${accessToken}` : '',
//       },
//    });

//    // if access token expired
//    if (res.status === 401) {
//       console.log('Access token expired, trying to refresh...');

//       // call refresh
//       const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', {
//          method: 'POST',
//          credentials: 'include',
//       });

//       if (refreshRes.ok) {
//          const refreshData = await refreshRes.json();
//          accessToken = refreshData.accessToken; //update token lokal

//          // console.log('Token refreshed: ', accessToken);

//          // retry original request
//          return fetch(url, {
//             ...options,
//             credentials: 'include',
//             headers: {
//                ...(isFormData ? {} : options.headers),
//                Authorization: `Bearer ${accessToken}`,
//             },
//          });
//       }
//    }

//    return res;
// }

export async function api(url, options = {}) {
   // console.log(accessToken);
   const isFormData = options.body instanceof FormData;

   const res = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
         ...(isFormData ? {} : options.headers),
         ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
   });

   // SUCCESS → langsung return
   if (res.status !== 401) {
      return res;
   }

   // ❌ Jangan refresh kalau:
   // - belum ada accessToken
   // - sedang refresh
   if (!accessToken || isRefreshing) {
      return res;
   }

   isRefreshing = true;
   console.warn('Access token expired, trying to refresh...');

   try {
      const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', {
         method: 'POST',
         credentials: 'include',
      });

      if (!refreshRes.ok) {
         return res; // silent fail
      }

      const refreshData = await refreshRes.json();
      accessToken = refreshData.accessToken;

      // retry original request
      return fetch(url, {
         ...options,
         credentials: 'include',
         headers: {
            ...(isFormData ? {} : options.headers),
            Authorization: `Bearer ${accessToken}`,
         },
      });
   } finally {
      isRefreshing = false;
   }
}
