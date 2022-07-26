if(!localStorage.getItem('commentData')) {
    const getData = async () => {
        const response = await fetch('./data.json');
        const data = response.json();
        return data;
    };

    getData()
        .then(data => {
            localStorage.setItem('commentsData', JSON.stringify(data.comments));
            localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
        });
};

const commentsData = JSON.parse(localStorage.getItem('commentsData'));
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// console.log(commentsData);
// console.log(currentUser);

commentsData.forEach(comment => {
    // ========= COMMENTS =========
    const commentItem = `
    
        <!-- ### COMMENT ### -->
        <div>
            <div class="md:p-8 bg-white shadow-lg rounded-md p-4 grid gap-3 comment-grid">
                <!-- header -->
                <header class="md:row-start-1 md:row-end-2 md:col-start-2 md:col-end-4 col-span-3 row-start-1 row-end-2">
                    <div class="flex items-center gap-2">
                        <div class="w-8">
                            <img src="${comment.user.image.png}" alt="${comment.user.username} profile picture">
                        </div>
                        <h2 class="font-medium text-blue-300">${comment.user.username}</h2>
                        ${comment.user.username === currentUser.username ? '<span class="bg-blue-200 text-white px-2 pb-2 pt-1 rounded leading-none">you</span>' : ''}
                        <!-- <span class="bg-blue-200 text-white px-2 pb-2 pt-1 rounded leading-none">you</span> -->
                        <span>${comment.createdAt}</span>
                    </div>
                </header>
                <!-- content -->
                <div class="md:row-start-2 md:row-end-3 md:col-start-2 md:col-end-5 col-span-3 row-start-2 row-end-3">
                    <p contenteditable="false">${comment.content}</p>
                </div>
                <!-- score -->
                <div class="md:row-start-1 md:row-end-3 md:col-start-1 md:col-end-2 col-span-1 row-start-3 row-end-4 w-fit">
                    <div class="md:flex-col md:px-2 md:py-4 flex items-center gap-3 font-medium text-blue-200 bg-gray-200 px-3 py-1 rounded w-fit">
                        <button type="button">
                            <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                        </button>
                        <span>${comment.score}</span>
                        <button type="button">
                            <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                        </button>
                    </div>
                </div>
                <!-- reply -->
                <div class="md:row-start-1 md:row-end-2 md:col-start-4 md:col-end-5 col-start-3 col-end-4 row-start-3 row-end-4">
                    <button class="ml-auto flex items-center gap-2 font-medium text-blue-200">
                        <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                        Reply
                    </button>
                </div>
            </div>
        </div>
        <!-- ### REPLIES ### -->
        <div class="replies-container h-0 overflow-hidden">
            <div class="replies-wrapper border-2 border-red-800"></div>
        </div>
        <!-- ### FORM ### -->
        <div class="h-0 overflow-hidden">
            <form class="md:p-8 bg-white shadow-lg rounded-md p-4 grid gap-3 form-grid">
                <!-- img -->
                <div class="col-span-1 row-start-3 row-end-4 w-10">
                    <img src="${currentUser.image.png}" alt="${currentUser.username}profile picture">
                </div>
                <!-- textarea -->
                <div class="col-span-3">
                    <textarea class="focus:outline-blue-200 outline-none border rounded-md py-2 px-3 w-full resize-none" name="comment" placeholder="Add a comment"></textarea>
                </div>
                <!-- send button -->
                <div class="col-star-3 col-end-4 row-start-3 row-end-4 text-right">
                    <button class="py-2 px-4 rounded-md text-white bg-blue-200 font-normal uppercase" type="submit">send</button>
                </div>
            </form>
        </div>

    `;
    const commentArticle = document.createElement('article');
    commentArticle.setAttribute('class', 'grid gap-2 md:gap-3');
    commentArticle.innerHTML = commentItem;

    const main = document.querySelector('main');
    main.appendChild(commentArticle);

    // ========= REPLIES =========
    // console.log(item.replies.length);
    if(comment.replies.length > 0) {

        comment.replies.forEach(reply => {
            console.log(reply ? true : false);
            
            const replyItem = `
        
                <!-- ### COMMENT ### -->
                <div>
                    <div class="md:p-8 bg-white shadow-lg rounded-md p-4 grid gap-3 comment-grid">
                        <!-- header -->
                        <header class="md:row-start-1 md:row-end-2 md:col-start-2 md:col-end-4 col-span-3 row-start-1 row-end-2">
                            <div class="flex items-center gap-2">
                                <div class="w-8">
                                    <img src="${reply.user.image.png}" alt="${reply.user.username} profile picture">
                                </div>
                                <h2 class="font-medium text-blue-300">${reply.user.username}</h2>
                                ${reply.user.username === currentUser.username ? '<span class="bg-blue-200 text-white px-2 pb-2 pt-1 rounded leading-none">you</span>' : ''}
                                <!-- <span class="bg-blue-200 text-white px-2 pb-2 pt-1 rounded leading-none">you</span> -->
                                <span>${reply.createdAt}</span>
                            </div>
                        </header>
                        <!-- content -->
                        <div class="md:row-start-2 md:row-end-3 md:col-start-2 md:col-end-5 col-span-3 row-start-2 row-end-3">
                            <p contenteditable="false">${reply.content}</p>
                        </div>
                        <!-- score -->
                        <div class="md:row-start-1 md:row-end-3 md:col-start-1 md:col-end-2 col-span-1 row-start-3 row-end-4 w-fit">
                            <div class="md:flex-col md:px-2 md:py-4 flex items-center gap-3 font-medium text-blue-200 bg-gray-200 px-3 py-1 rounded w-fit">
                                <button type="button">
                                    <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                                </button>
                                <span>${reply.score}</span>
                                <button type="button">
                                    <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                                </button>
                            </div>
                        </div>
                        <!-- reply -->
                        <div class="md:row-start-1 md:row-end-2 md:col-start-4 md:col-end-5 col-start-3 col-end-4 row-start-3 row-end-4">
                            <button class="ml-auto flex items-center gap-2 font-medium text-blue-200">
                                <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
                <!-- ### FORM ### -->
                <div class="h-0 overflow-hidden">
                    <form class="md:p-8 bg-white shadow-lg rounded-md p-4 grid gap-3 form-grid">
                        <!-- img -->
                        <div class="col-span-1 row-start-3 row-end-4 w-10">
                            <img src="${currentUser.image.png}" alt="${currentUser.username}profile picture">
                        </div>
                        <!-- textarea -->
                        <div class="col-span-3">
                            <textarea class="focus:outline-blue-200 outline-none border rounded-md py-2 px-3 w-full resize-none" name="comment" placeholder="Add a comment"></textarea>
                        </div>
                        <!-- send button -->
                        <div class="col-star-3 col-end-4 row-start-3 row-end-4 text-right">
                            <button class="py-2 px-4 rounded-md text-white bg-blue-200 font-normal uppercase" type="submit">send</button>
                        </div>
                    </form>
                </div>
    
            `;
            const replyArticle = document.createElement('article');
            replyArticle.setAttribute('class', 'grid gap-2 md:gap-3');
            replyArticle.innerHTML = replyItem;
            // replies container & wrapper - append replies
            const repliesContainer = commentArticle.querySelector('.replies-container');
            const repliesWrapper = commentArticle.querySelector('.replies-wrapper');

            // repliesContainer.classList.remove('h-0');
            // repliesContainer.classList.add('h-auto');
            console.log(repliesContainer);
            repliesWrapper.appendChild(replyArticle);
        })
    }

});
