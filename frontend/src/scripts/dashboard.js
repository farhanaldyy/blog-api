import { readPosts } from '../api/blogs.js';

async function rederData() {
   try {
      const res = await readPosts();
      if (!res.ok) return console.log('data posting not found'); // this is a dummy for console, in real dev append text to content

      console.log(res);
      // create foreach data
      // res.forEach((data) => {
      //    const listPosting = document.getElementById('list-posts');
      //    const card = document.createElement('div');
      //    // append data in this foreach
      // });
   } catch (err) {
      console.log(err);
   }
}

rederData();
