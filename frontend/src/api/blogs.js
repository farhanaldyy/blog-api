import { api } from '../utils/api.js';
import { bootstrapAuth } from '../utils/bootstrapAuth.js';
const URL_API = 'http://localhost:5000/api/blogs';

// read all post (author)
async function readPosts() {
   await bootstrapAuth();

   try {
      const res = await api(`${URL_API}/`, {
         method: 'GET',
      });

      const data = await res.json().catch(() => ({}));

      return {
         ...data,
      };
   } catch (err) {
      return {
         ok: false,
         message: err.message,
      };
   }
}

// get post (by ID)
async function getPostById(id) {
   // token confirm
   await bootstrapAuth();

   try {
      const res = await api(`${URL_API}/${id}`, {
         method: 'GET',
      });

      const data = await res.json().catch(() => ({}));

      return {
         ...data,
      };
   } catch (err) {
      return {
         ok: false,
         message: err.message,
      };
   }
}

// create post
async function createPosts(title, content, coverImage, tags, category, status, publish) {
   const formData = new FormData();
   formData.append('title', title);
   formData.append('content', content);

   // cover image must be file (file/blob)
   if (coverImage instanceof File) {
      formData.append('coverImage', coverImage);
   }

   // tags / category to array
   if (Array.isArray(tags)) {
      tags.forEach((tag) => {
         formData.append('tags[]', tag);
      });
   } else {
      formData.append('tags', tags);
   }

   if (Array.isArray(category)) {
      category.forEach((data) => {
         formData.append('categories[]', data);
      });
   } else {
      formData.append('categories', category);
   }

   formData.append('publishAt', publish ?? '');
   formData.append('status', status);

   // token check
   await bootstrapAuth();

   try {
      const res = await api(`${URL_API}/`, {
         method: 'POST',
         body: formData,
      });

      const data = await res.json().catch(() => ({}));

      return {
         ok: res.ok,
         message: res.message,
         ...data,
      };
   } catch (err) {
      return {
         ok: false,
         message: err.message,
      };
   }
}

// updated post
async function updatedPost(id, payload, coverImage) {
   const formData = new FormData();
   formData.append('title', payload.title);
   formData.append('content', payload.content);

   if (coverImage instanceof File) {
      formData.append('coverImage', coverImage);
   }

   if (Array.isArray(payload.tags)) {
      payload.tags.forEach((tag) => {
         formData.append('tags[]', tag);
      });
   } else {
      formData.append('tags', payload.tags);
   }

   if (Array.isArray(payload.category)) {
      payload.category.forEach((data) => {
         formData.append('categories[]', data);
      });
   } else {
      formData.append('categories', payload.category);
   }

   formData.append('status', payload.status);
   formData.append('publishAt', payload.publish ?? '');

   // token check
   await bootstrapAuth();

   try {
      const res = await api(`${URL_API}/${id}`, {
         method: 'PUT',
         body: formData,
      });

      const data = await res.json().catch(() => ({}));

      return {
         ok: res.ok,
         message: 'updated success!',
         ...data,
      };
   } catch (err) {
      return {
         ok: false,
         message: err.message,
      };
   }
}

// deleted post
async function deletedPost(id) {
   // token check

   await bootstrapAuth();

   try {
      const res = await api(`${URL_API}/${id}`, {
         method: 'DELETE',
      });

      const data = await res.json().catch(() => ({}));

      return {
         ok: res.ok,
         message: res.message,
      };
   } catch (err) {
      return {
         ok: false,
         message: err.message,
      };
   }
}

export { createPosts, readPosts, getPostById, updatedPost, deletedPost };
