URL_API = 'http://localhost:5000/api/blogs';

async function createPosts(coverImage, title, tags, category, content, publish) {
   try {
      const res = await fetch(`${URL_API}/`, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer`,
         },
      });
   } catch (error) {}
}
