URI_API = 'http://localhost:5000/api/auth';

async function register(uname, email, password, role) {
   console.log(uname, email, password, role);

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
   } catch (error) {
      return {
         ok: false,
         message: `Server error: ${error.message}`,
      };
   }
}
