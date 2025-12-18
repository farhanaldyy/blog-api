import { api } from '../utils/api.js';
import { bootstrapAuth } from '../utils/bootstrapAuth.js';
const URI_API = 'http://localhost:5000/api/user';

// read profile
async function readProfile() {
   try {
      await bootstrapAuth();
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

// get total post db.posts.countDocuments({ authorId: ObjectId("6936bd9f8fc921324db18bb4") });
