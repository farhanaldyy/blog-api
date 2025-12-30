import { readPosts, deletedPost } from '../api/blogs.js';
import { formatedDate } from '../utils/formatDate.js';

const listPost = document.getElementById('list-posts');

// entry point
async function renderData() {
   try {
      const raw = await readPosts();
      const posts = Array.isArray(raw) ? raw : Object.values(raw);

      if (posts.length === 0) {
         listPost.innerHTML = `<p class='text-xl font-semibold text-neutral-900'>No post available</p>`;
         return;
      }

      // list menu indicator
      const postIndicator = (document.querySelector('.p-indicator').textContent = posts.length);

      listPost.innerHTML = '';
      renderPosts(posts);
   } catch (err) {
      console.error('Render failed:', err);
      listPost.innerHTML = `<p class='text-xl font-semibold text-red-700'>Failed to load data</p>`;
   }
}

// render collection
function renderPosts(posts) {
   const fragment = document.createDocumentFragment();

   posts.forEach((post) => {
      fragment.append(createPostCard(post));
   });

   listPost.append(fragment);
}

// single card component
function createPostCard(post) {
   const card = document.createElement('div');
   card.className = 'flex justify-between items-center p-4 rounded-lg bg-white border border-neutral-200';

   // div title
   const titlePub = document.createElement('div');
   titlePub.className = 'flex flex-col gap-1';

   // title
   const title = document.createElement('h1');
   title.className = 'max-w-[250px] truncate text-lg font-semibold';
   title.textContent = post.title ?? 'Untitled';

   // published
   const published = document.createElement('span');
   published.className = 'text-sm text-neutral-500';
   published.textContent = post.publishAt ? `Published: ${formatedDate(post.publishAt)}` : null;

   // status
   const status = document.createElement('span');
   // status.textContent = post.status ?? 'draft';
   if (post.status === 'published') {
      titlePub.append(title, published);
      status.className = 'text-sm text-neutral-500';
      status.innerHTML = `<i class="fa-regular fa-heart"></i>${0} <i class="fa-regular fa-comment ms-2"></i>${0}  <i class="fa-regular fa-eye ms-2"></i>${'<25'}`;
   } else {
      titlePub.append(title);
      status.className = 'text-sm bg-amber-100 px-2 py-1 rounded-md';
      status.textContent = 'Draft';
   }

   // actions
   const actions = document.createElement('div');
   actions.className = 'flex gap-4';

   actions.innerHTML = `
      <button data-action="delete" data-id="${post['_id']}" class="text-sm font-medium text-red-700 hover:cursor-pointer">Delete</button>
      <a href="./create-post.html?id=${post['_id']}" class="text-sm">Edit</a>

      <el-dropdown class="relative text-sm">
         <button class="relative flex rounded-full hover:cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 32 32">
               <circle cx="6" cy="16" r="2"/>
               <circle cx="16" cy="16" r="2"/>
               <circle cx="26" cy="16" r="2"/>
            </svg>
         </button>

         <el-menu
            anchor="bottom end"
            popover
            class="w-40 rounded-md bg-white py-1 shadow-lg">
            <a href="#" class="block px-4 py-2 text-sm">Stats</a>
            <button
               data-action="archive"
               data-id="${post['_id']}"
               class="block w-full text-left px-4 py-2 text-sm hover:cursor-pointer">
               Archive post
            </button>
         </el-menu>
      </el-dropdown>
   `;

   card.append(titlePub, status, actions);
   return card;
}

// event delegation
listPost.addEventListener('click', async (e) => {
   const action = e.target.dataset.action;
   const postId = e.target.dataset.id;

   if (!action || !postId) return;

   switch (action) {
      case 'delete':
         if (!confirm('Are you sure you want to delete this item?')) {
            e.preventDefault();
            return;
         }

         try {
            await deletedPost(postId);
            await renderData();
         } catch (err) {
            alert('Failed to delete data');
         }

         break;
      case 'archive':
         console.log('ARCHIVE', postId);
         break;
      default:
         console.warn('Unknown actions');
   }
});

renderData();
