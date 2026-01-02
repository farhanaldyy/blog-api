import { getPostById } from '../api/blogs.js';

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

async function getPosting(id) {
   try {
      const post = await getPostById(id);

      postCard(post);
   } catch (err) {
      console.log(err.message);
   }
}

function postCard(post) {}

getPosting(postId);
