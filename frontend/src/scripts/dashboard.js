import { readPosts } from '../api/blogs.js';

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

   // title
   const title = document.createElement('h1');
   title.className = 'max-w-[300px] truncate text-lg font-medium';
   title.textContent = post.title ?? 'Untitled';

   // status
   const status = document.createElement('span');
   status.className = 'text-sm bg-amber-100 px-2 py-1 rounded-md';
   status.textContent = post.status ?? 'draft';

   // actions
   const actions = document.createElement('div');
   actions.className = 'flex gap-4';

   actions.innerHTML = `
      <button data-action="delete" data-id="${post['_id']}" class="text-sm font-medium text-red-700 hover:cursor-pointer">Delete</button>
      <a href="/edit/${post['_id']}" class="text-sm">Edit</a>

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
               class="block w-full text-left px-4 py-2 text-sm">
               Archive post
            </button>
         </el-menu>
      </el-dropdown>
   `;

   card.append(title, status, actions);
   return card;
}

// event delegation
listPost.addEventListener('click', (e) => {
   const action = e.target.dataset.action;
   const postId = e.target.dataset.id;

   if (!action || !postId) return;

   switch (action) {
      case 'delete':
         console.log('DELETE', postId);
         break;
      case 'archive':
         console.log('ARCHIVE', postId);
         break;
   }
});

/**
 * versi pertama
async function renderData() {
   try {
      // get data from api
      const res = await readPosts();
      if (!res) return console.log('data posting not found'); // this is a dummy for console, in real dev append text to content

      // div list
      const listPost = document.getElementById('list-posts');

      for (const key in res) {
         const cardPost = document.createElement('div');
         cardPost.classList = 'flex justify-between items-center p-4 rounded-lg bg-white border border-neutral-200';
         cardPost.innerHTML = `
            <h1 class="max-w-[300px] truncate text-lg font-medium">${res[key].title}</h1>
            <span id="status-blog" class="text-sm bg-amber-100 px-2 py-1 rounded-md">${res[key].status}</span>
            <div class="flex gap-4">
               <a id='btn-deleted' class="text-sm font-medium text-red-700 hover:cursor-pointer">Delete</a>
               <a href="#" class="text-sm">Edit</a>
               <el-dropdown class="relative text-sm">
                  <button class="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 hover:cursor-pointer">
                     <span class="absolute -inset-1.5"></span>
                     <span class="sr-only">Open user menu</span>
                     <svg
                        fill="#000000"
                        width="20px"
                        height="20px"
                        viewBox="0 0 32 32"
                        enable-background="new 0 0 32 32"
                        id="Glyph"
                        version="1.1"
                        xml:space="preserve"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z" id="XMLID_287_" />
                        <path d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z" id="XMLID_289_" />
                        <path d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z" id="XMLID_291_" />
                     </svg>
                  </button>

                  <el-menu
                     anchor="bottom end"
                     popover
                     class="w-40 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                     <a href="#" class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden">Stats</a>
                     <a id="archive" href="#" class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden">Archive post</a>
                  </el-menu>
               </el-dropdown>
            </div>
         `;
         listPost.append(cardPost);
      }
   } catch (err) {
      console.log(err);
   }
}
**/
renderData();
