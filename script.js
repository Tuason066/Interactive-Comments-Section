/* SETUP DATA */
const getData = async () => {
    const response = await fetch('data.json');
    const data = response.json();
    return data;
};

if(!localStorage.getItem('comments')) {
    getData()
        .then(data => {
            localStorage.setItem('comments', JSON.stringify(data.comments));
            localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
            window.location.reload();
        });
};

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const commentsData = JSON.parse(localStorage.getItem('comments'));

/* REPLY DATA OBJECT */
class Reply {
    constructor(content, createdAt, id, replyingTo, score, user) {
        this.content = content;
        this.createdAt = createdAt;
        this.id = id;
        this.replyingTo = replyingTo;
        this.score = score;
        this.user = user;
    }
};

/* HOVERS */
const svgsBlueButtons = buttons => {
    buttons.forEach(btn => {
        const svg = btn.querySelector('path');
        btn.addEventListener('mouseover', () => svg.setAttribute('fill', 'hsl(239, 57%, 85%)'));
        btn.addEventListener('mouseout', () => svg.setAttribute('fill', 'hsl(238, 40%, 52%)'));
    });
};
const svgsBlueOppositeButtons = buttons => {
    buttons.forEach(btn => {
        const svg = btn.querySelector('path');
        btn.addEventListener('mouseover', () => svg.setAttribute('fill', 'hsl(238, 40%, 52%)'));
        btn.addEventListener('mouseout', () => svg.setAttribute('fill', 'hsl(239, 57%, 85%)'));
    });
};
const svgsRedButtons = buttons => {
    buttons.forEach(btn => {
        const svg = btn.querySelector('path');
        btn.addEventListener('mouseover', () => svg.setAttribute('fill', 'hsl(357, 100%, 86%)'));
        btn.addEventListener('mouseout', () => svg.setAttribute('fill', 'hsl(358, 79%, 66%)'));
    });
};
/* COMMENT BUTTONS */
const saveReply = (commentID, obj) => {
    const comments = JSON.parse(localStorage.getItem('comments'));

    const newComments = comments.map(comment => {

        commentID === comment.id.toString() && comment.replies.push(obj);
        return comment;
    });
    localStorage.setItem('comments', JSON.stringify(newComments));
};
const deleteReply = buttons => {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const replyComment = btn.closest('.reply-comment');
            const replyID = replyComment.dataset.id;
    
            replyComment.remove();
    
            const comments = JSON.parse(localStorage.getItem('comments'));
            const newComments = comments.map(comment => {
    
                const newReplies = comment.replies.filter(item => {
                    if(replyID != item.id) {
                        return item;
                    };
                })
    
                comment.replies = newReplies;
                return comment;
            });
    
            localStorage.setItem('comments', JSON.stringify(newComments));
        });
    });
};
const editReply = buttons => {
    buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const comment = btn.closest('.comment-container');
        const commentID = comment.dataset.id;
        const replyComment = btn.closest('.reply-comment');
        const replyID = replyComment.dataset.id;
        const contentContainer = replyComment.querySelector('.content');
        const content = replyComment.querySelector('.content p');

        let replyContent = '';
        let replyReplyingTo = '';

        const data = JSON.parse(localStorage.getItem('comments'));
        data.forEach(comment => {
            if(comment.id == commentID) {
                comment.replies.forEach(reply => {
                    if(reply.id == replyID) {
                        replyContent = reply.content;
                        replyReplyingTo = reply.replyingTo;
                    }
                })
            }
        })

        contentContainer.innerHTML = `
            <div class="">
                <textarea class="placeholder:text-gray-300 outline-blue-200 w-full resize-none border border-gray-200 rounded py-2 px-2" placeholder="Add a comment..."></textarea>
            </div>
            <div class="flex justify-end my-2">
                <button class="update-btn px-4 pt-1 pb-2 rounded uppercase hover:bg-blue-100 bg-blue-200 text-white font-bold transition-all" type="button">update</button>
            </div>
        `;

        const textArea = contentContainer.querySelector('textarea');
        textArea.value = replyContent;

        const updateButton = contentContainer.querySelector('.update-btn');
        updateButton.addEventListener('click', () => {
            contentContainer.innerHTML = `<p>${mentioned(textArea.value, replyReplyingTo)}</p>`;

            const updateData = data.map(comment => {
                if(comment.id == commentID) {
                    const newReplies = comment.replies.map(reply => {
                        if(reply.id == replyID) {
                            reply.content = textArea.value;
                        }
                        return reply;
                    });
                    comment.replies = newReplies;
                }
                return comment
            });

            localStorage.setItem('comments', JSON.stringify(updateData));
        });
    });
});
};
/* SCORE BUTTONS */
const commentPlusButtons = buttons => {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            /* article */
            const commentContainer = btn.closest('.comment-container');
            const commentID = commentContainer.dataset.id;
    
            /* comment */
            const comment = btn.closest('.main-comment');
            const score = comment.querySelector('.score-count');
            let scoreValue = parseInt(score.textContent);
            scoreValue++;
            score.textContent = scoreValue;
    
            /* LOCAL STORAGE */
            const data = JSON.parse(localStorage.getItem('comments'));
            const newData = data.map(comment => {
                if(commentID == comment.id) {
                    comment.score = scoreValue;
                }
                return comment
            })
            localStorage.setItem('comments', JSON.stringify(newData));
        });
    });
};
const commentMinusButtons = buttons => {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            /* article */
            const commentContainer = btn.closest('.comment-container');
            const commentID = commentContainer.dataset.id;
    
            /* comment */
            const comment = btn.closest('.main-comment');
            const score = comment.querySelector('.score-count');
            let scoreValue = parseInt(score.textContent);
            if(scoreValue >= 1) {
                scoreValue--;
            }

            score.textContent = scoreValue;
    
            /* LOCAL STORAGE */
            const data = JSON.parse(localStorage.getItem('comments'));
            const newData = data.map(comment => {
                if(commentID == comment.id) {
                    comment.score = scoreValue;
                }
                return comment
            })
            localStorage.setItem('comments', JSON.stringify(newData));
        });
    });
};
const replyCommentPlusButtons = buttons => {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            /* article */
            const commentContainer = btn.closest('.comment-container');
            const commentID = commentContainer.dataset.id;
    
            /* comment */
            const replyComment = btn.closest('.reply-comment');
            const replyCommentID = replyComment.dataset.id;
            const score = replyComment.querySelector('.score-count');
            let scoreValue = parseInt(score.textContent);
            scoreValue++;
            score.textContent = scoreValue;
    
            /* LOCAL STORAGE */
            const data = JSON.parse(localStorage.getItem('comments'));
            const newData = data.map(comment => {
                if(commentID == comment.id) {
                    const newReplies = comment.replies.map(reply => {
                        if(reply.id == replyCommentID) {
                            reply.score = scoreValue;
                        }
                        return reply;
                    });
                    comment.replies = newReplies;
                }
                return comment;
            })
            localStorage.setItem('comments', JSON.stringify(newData));
        });
    });
};
const replyCommentMinusButtons = buttons => {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            /* article */
            const commentContainer = btn.closest('.comment-container');
            const commentID = commentContainer.dataset.id;
    
            /* comment */
            const replyComment = btn.closest('.reply-comment');
            const replyCommentID = replyComment.dataset.id;
            const score = replyComment.querySelector('.score-count');
            let scoreValue = parseInt(score.textContent);

            if(scoreValue >= 1) {
                scoreValue--;
            }

            score.textContent = scoreValue;
    
            /* LOCAL STORAGE */
            const data = JSON.parse(localStorage.getItem('comments'));
            const newData = data.map(comment => {
                if(commentID == comment.id) {
                    const newReplies = comment.replies.map(reply => {
                        if(reply.id == replyCommentID) {
                            reply.score = scoreValue;
                        }
                        return reply;
                    });
                    comment.replies = newReplies;
                }
                return comment;
            })
            localStorage.setItem('comments', JSON.stringify(newData));
        });
    });
};
/* COMMENT CONVERSION */
const mentioned = (content, username) => {
    const usernameAt = new RegExp("@" + username);

    if(usernameAt.test(content)) {
        // return 'mentioned'
        return content.replace(usernameAt, `<span class="text-blue-200 font-medium">@${username}</span>`);

    } else {
        // return 'not mentioned'
        if(username == '') {
            return content;
        } else {
            return `<span class="text-blue-200 font-medium">@${username} </span>${content}`;
        };
    } ;
    
    /* 
    <span class="text-blue-200 font-medium">@${replyingTo} </span>${content}
     */
};
/* TIME CONVERSION */
const timeConversion = (time) => {

    if(/\D+/g.test(time)) {
        return time;
    } else {
        const currentTime = new Date();
        const t = currentTime - time;
        // return t;
        
        if(t <= 1000) {
            return '1 second ago';
        } else if (t <= 1000 * 2) {
            return '2 seconds ago'
        } else if (t <= 1000 * 3) {
            return '3 seconds ago'
        } else if (t <= 1000 * 4) {
            return '4 seconds ago'
        } else if (t <= 1000 * 5) {
            return '5 seconds ago'
        } else if (t <= 1000 * 6) {
            return '6 seconds ago'
        } else if (t <= 1000 * 7) {
            return '7 seconds ago'
        } else if (t <= 1000 * 8) {
            return '8 seconds ago'
        } else if (t <= 1000 * 9) {
            return '9 seconds ago'
        } else if (t <= 1000 * 10) {
            return '10 seconds ago'
        } else if (t <= 1000 * 11) {
            return '11 seconds ago'
        } else if (t <= 1000 * 12) {
            return '12 seconds ago'
        } else if (t <= 1000 * 13) {
            return '13 seconds ago'
        } else if (t <= 1000 * 14) {
            return '14 seconds ago'
        } else if (t <= 1000 * 15) {
            return '15 seconds ago'
        } else if (t <= 1000 * 16) {
            return '16 seconds ago'
        } else if (t <= 1000 * 17) {
            return '17 seconds ago'
        } else if (t <= 1000 * 18) {
            return '18 seconds ago'
        } else if (t <= 1000 * 19) {
            return '19 seconds ago'
        } else if (t <= 1000 * 20) {
            return '20 seconds ago'
        } else if (t <= 1000 * 21) {
            return '21 seconds ago'
        } else if (t <= 1000 * 22) {
            return '22 seconds ago'
        } else if (t <= 1000 * 23) {
            return '23 seconds ago'
        } else if (t <= 1000 * 24) {
            return '24 seconds ago'
        } else if (t <= 1000 * 25) {
            return '25 seconds ago'
        } else if (t <= 1000 * 26) {
            return '26 seconds ago'
        } else if (t <= 1000 * 27) {
            return '27 seconds ago'
        } else if (t <= 1000 * 28) {
            return '28 seconds ago'
        } else if (t <= 1000 * 29) {
            return '29 seconds ago'
        } else if (t <= 1000 * 30) {
            return '30 seconds ago'
        } else if (t <= 1000 * 31) {
            return '31 seconds ago'
        } else if (t <= 1000 * 32) {
            return '32 seconds ago'
        } else if (t <= 1000 * 33) {
            return '33 seconds ago'
        } else if (t <= 1000 * 34) {
            return '34 seconds ago'
        } else if (t <= 1000 * 35) {
            return '35 seconds ago'
        } else if (t <= 1000 * 36) {
            return '36 seconds ago'
        } else if (t <= 1000 * 37) {
            return '37 seconds ago'
        } else if (t <= 1000 * 38) {
            return '38 seconds ago'
        } else if (t <= 1000 * 39) {
            return '39 seconds ago'
        } else if (t <= 1000 * 40) {
            return '40 seconds ago'
        } else if (t <= 1000 * 41) {
            return '41 seconds ago'
        } else if (t <= 1000 * 42) {
            return '42 seconds ago'
        } else if (t <= 1000 * 43) {
            return '43 seconds ago'
        } else if (t <= 1000 * 44) {
            return '44 seconds ago'
        } else if (t <= 1000 * 45) {
            return '45 seconds ago'
        } else if (t <= 1000 * 46) {
            return '46 seconds ago'
        } else if (t <= 1000 * 47) {
            return '47 seconds ago'
        } else if (t <= 1000 * 48) {
            return '48 seconds ago'
        } else if (t <= 1000 * 49) {
            return '49 seconds ago'
        } else if (t <= 1000 * 50) {
            return '50 seconds ago'
        } else if (t <= 1000 * 51) {
            return '51 seconds ago'
        } else if (t <= 1000 * 52) {
            return '52 seconds ago'
        } else if (t <= 1000 * 53) {
            return '53 seconds ago'
        } else if (t <= 1000 * 54) {
            return '54 seconds ago'
        } else if (t <= 1000 * 55) {
            return '55 seconds ago'
        } else if (t <= 1000 * 56) {
            return '56 seconds ago'
        } else if (t <= 1000 * 57) {
            return '57 seconds ago'
        } else if (t <= 1000 * 58) {
            return '58 seconds ago'
        } else if (t <= 1000 * 59) {
            return '59 seconds ago'
        } else if (t <= 1000 * 60) {
            return '1 minute ago'
        } else if (t < 1000 * 60 * 2) {
            return '1 minute ago'
        } else if (t < 1000 * 60 * 3) {
            return '2 minutes ago'
        } else if (t < 1000 * 60 * 4) {
            return '3 minutes ago'
        } else if (t < 1000 * 60 * 5) {
            return '4 minutes ago'
        } else if (t < 1000 * 60 * 6) {
            return '5 minutes ago'
        } else if (t < 1000 * 60 * 7) {
            return '6 minutes ago'
        } else if (t < 1000 * 60 * 8) {
            return '7 minutes ago'
        } else if (t < 1000 * 60 * 9) {
            return '8 minutes ago'
        } else if (t < 1000 * 60 * 10) {
            return '9 minutes ago'
        } else if (t < 1000 * 60 * 11) {
            return '10 minutes ago'
        } else if (t < 1000 * 60 * 12) {
            return '11 minutes ago'
        } else if (t < 1000 * 60 * 13) {
            return '12 minutes ago'
        } else if (t < 1000 * 60 * 14) {
            return '13 minutes ago'
        } else if (t < 1000 * 60 * 15) {
            return '14 minutes ago'
        } else if (t < 1000 * 60 * 16) {
            return '15 minutes ago'
        } else if (t < 1000 * 60 * 17) {
            return '16 minutes ago'
        } else if (t < 1000 * 60 * 18) {
            return '17 minutes ago'
        } else if (t < 1000 * 60 * 19) {
            return '18 minutes ago'
        } else if (t < 1000 * 60 * 20) {
            return '19 minutes ago'
        } else if (t < 1000 * 60 * 21) {
            return '20 minutes ago'
        } else if (t < 1000 * 60 * 21) {
            return '21 minutes ago'
        } else if (t < 1000 * 60 * 23) {
            return '21 minutes ago'
        } else if (t < 1000 * 60 * 24) {
            return '23 minutes ago'
        } else if (t < 1000 * 60 * 25) {
            return '24 minutes ago'
        } else if (t < 1000 * 60 * 26) {
            return '25 minutes ago'
        } else if (t < 1000 * 60 * 27) {
            return '26 minutes ago'
        } else if (t < 1000 * 60 * 28) {
            return '27 minutes ago'
        } else if (t < 1000 * 60 * 29) {
            return '28 minutes ago'
        } else if (t < 1000 * 60 * 30) {
            return '29 minutes ago'
        } else if (t < 1000 * 60 * 31) {
            return '30 minutes ago'
        } else if (t < 1000 * 60 * 32) {
            return '31 minutes ago'
        } else if (t < 1000 * 60 * 33) {
            return '32 minutes ago'
        } else if (t < 1000 * 60 * 34) {
            return '33 minutes ago'
        } else if (t < 1000 * 60 * 35) {
            return '34 minutes ago'
        } else if (t < 1000 * 60 * 36) {
            return '35 minutes ago'
        } else if (t < 1000 * 60 * 37) {
            return '36 minutes ago'
        } else if (t < 1000 * 60 * 38) {
            return '37 minutes ago'
        } else if (t < 1000 * 60 * 39) {
            return '38 minutes ago'
        } else if (t < 1000 * 60 * 40) {
            return '39 minutes ago'
        } else if (t < 1000 * 60 * 41) {
            return '40 minutes ago'
        } else if (t < 1000 * 60 * 42) {
            return '41 minutes ago'
        } else if (t < 1000 * 60 * 43) {
            return '42 minutes ago'
        } else if (t < 1000 * 60 * 44) {
            return '43 minutes ago'
        } else if (t < 1000 * 60 * 45) {
            return '44 minutes ago'
        } else if (t < 1000 * 60 * 46) {
            return '45 minutes ago'
        } else if (t < 1000 * 60 * 47) {
            return '46 minutes ago'
        } else if (t < 1000 * 60 * 48) {
            return '47 minutes ago'
        } else if (t < 1000 * 60 * 49) {
            return '48 minutes ago'
        } else if (t < 1000 * 60 * 50) {
            return '49 minutes ago'
        } else if (t < 1000 * 60 * 52) {
            return '50 minutes ago'
        } else if (t < 1000 * 60 * 52) {
            return '52 minutes ago'
        } else if (t < 1000 * 60 * 53) {
            return '52 minutes ago'
        } else if (t < 1000 * 60 * 54) {
            return '53 minutes ago'
        } else if (t < 1000 * 60 * 55) {
            return '54 minutes ago'
        } else if (t < 1000 * 60 * 56) {
            return '55 minutes ago'
        } else if (t < 1000 * 60 * 57) {
            return '56 minutes ago'
        } else if (t < 1000 * 60 * 58) {
            return '57 minutes ago'
        } else if (t < 1000 * 60 * 59) {
            return '58 minutes ago'
        } else if (t < 1000 * 60 * 60) {
            return '59 minutes ago'
        } else if (t < 1000 * 60 * 60 * 2) {
            return '1 hour ago'
        } else if (t < 1000 * 60 * 60 * 3) {
            return '2 hours ago'
        } else if (t < 1000 * 60 * 60 * 4) {
            return '3 hours ago'
        } else if (t < 1000 * 60 * 60 * 5) {
            return '4 hours ago'
        } else if (t < 1000 * 60 * 60 * 6) {
            return '5 hours ago'
        } else if (t < 1000 * 60 * 60 * 7) {
            return '6 hours ago'
        } else if (t < 1000 * 60 * 60 * 8) {
            return '7 hours ago'
        } else if (t < 1000 * 60 * 60 * 9) {
            return '8 hours ago'
        } else if (t < 1000 * 60 * 60 * 10) {
            return '9 hours ago'
        } else if (t < 1000 * 60 * 60 * 11) {
            return '10 hours ago'
        } else if (t < 1000 * 60 * 60 * 12) {
            return '11 hours ago'
        } else if (t < 1000 * 60 * 60 * 13) {
            return '12 hours ago'
        } else if (t < 1000 * 60 * 60 * 14) {
            return '13 hours ago'
        } else if (t < 1000 * 60 * 60 * 15) {
            return '14 hours ago'
        } else if (t < 1000 * 60 * 60 * 16) {
            return '15 hours ago'
        } else if (t < 1000 * 60 * 60 * 17) {
            return '16 hours ago'
        } else if (t < 1000 * 60 * 60 * 18) {
            return '17 hours ago'
        } else if (t < 1000 * 60 * 60 * 19) {
            return '18 hours ago'
        } else if (t < 1000 * 60 * 60 * 20) {
            return '19 hours ago'
        } else if (t < 1000 * 60 * 60 * 21) {
            return '20 hours ago'
        } else if (t < 1000 * 60 * 60 * 22) {
            return '21 hours ago'
        } else if (t < 1000 * 60 * 60 * 23) {
            return '22 hours ago'
        } else if (t < 1000 * 60 * 60 * 24) {
            return '23 hours ago'
        } else if (t < 1000 * 60 * 60 * 24 * 2) {
            return '1 day ago'
        } else if (t < 1000 * 60 * 60 * 24 * 3) {
            return '2 days ago'
        } else if (t < 1000 * 60 * 60 * 24 * 4) {
            return '3 days ago'
        } else if (t < 1000 * 60 * 60 * 24 * 5) {
            return '4 days ago'
        } else if (t < 1000 * 60 * 60 * 24 * 6) {
            return '5 days ago'
        } else if (t < 1000 * 60 * 60 * 24 * 7) {
            return '6 days ago'
        } else if (t < 1000 * 60 * 60 * 24 * 7 * 2) {
            return '1 week ago'
        }


    };

}
/* COMMENTS TEMPLATES */
const commentsTemplate = (content, createdAt, id, score, image, username) => {
    return `

        <!-- comment -->
        <article class="main-comment comment-grid md:gap-4 gap-3 bg-white md:p-8 p-4 rounded shadow-sm">
            <!-- user profile -->
            <div class="user-profile md:col-start-2 md:col-end-4 row-start-1 row-end-2 col-start-1 col-end-5 flex items-center gap-2">
                <div class="max-w-[2.25rem]">
                <a class="block" href=""><img class="w-100" src="${image}" alt="${username} profile picture"></a>
                </div>
                <h2 class="username text-blue-200 font-bold">${username}</h2>
                <span>${timeConversion(createdAt)}</span>
            </div>

            <!-- content -->
            <div class="md:row-start-2 md:row-end-5 md:col-start-2 md:col-end-5 row-start-2 row-end-3 col-start-1 col-end-5">
                <p>${content}</p>
            </div>

            <!-- score -->
            <div class="md:row-start-1 md:row-span-full row-start-3 row-end-4 col-start-1 col-end-2">
                <div class="md:flex-col flex items-center gap-2 bg-gray-200 w-fit rounded">
                    <button class="comment-plus-score-btn plus-score-btn animations-svg-blue-opp flex justify-center items-center md:px-3 md:pt-3 md:pb-1 py-2 pr-1 pl-3 block" type="button">
                        <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                    </button>
                    <span class="score-count text-blue-200 font-bold">${score}</span>
                    <button class="comment-minus-score-btn minus-score-btn animations-svg-blue-opp flex justify-center items-center md:px-3 md:pt-1 md:pb-4 py-2 pl-1 pr-3 block" type="button">
                        <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                    </button>
                </div>
            </div>

            <!-- reply -->
            <div class="md:row-start-1 md:row-end-2 row-start-3 row-end-4 col-start-4 col-end-5 flex items-center justify-right">
                <button class="comment-reply-btn animation-svg-blue transition-all flex items-center gap-1 font-bold hover:text-blue-100 text-blue-200" type="button">
                <!-- <img class="w-100" src="./images/icon-reply.svg" alt="reply button icon"> -->
                    <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                    Reply
                </button>
            </div>
        </article>

        <!-- replies -->
        <div class="replies-container hidden">
            <div class="replies-wrapper border-l border-gray-300 grid md:gap-4 gap-2">

            </div>
        </div>

        <!-- form -->
        <form class="form-container h-0 overflow-hidden transition-all duration-500"><!-- col 4 row 3 -->
            <div class="form-wrapper form-grid md:gap-4 gap-3 bg-white md:p-8 p-4 rounded shadow-sm">
                <!-- textarea -->
                <div class="md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-4 col-start-1 col-end-5 row-start-1 row-end-3">
                    <textarea class="placeholder:text-gray-300 outline-blue-200 w-full resize-none border border-gray-200 rounded py-2 px-2" placeholder="Add a comment..."></textarea>
                </div>
                <!-- current user profile -->
                <div class="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 col-start-1 col-end-2 row-start-3 row-end-4">
                    <a class="block max-w-[2.5rem]" href="">
                        <img class="w-full" src="${currentUser.image.webp}" alt="${currentUser.username} profile picture">
                    </a>
                </div>
                <!-- send button -->
                <div class="md:col-start-4 md:col-end-5 md:row-start-1 md:row-end-2 col-start-4 col-end-5 row-start-3 row-end-4">
                    <button class="px-4 pt-1 pb-2 rounded uppercase hover:bg-blue-100 bg-blue-200 text-white font-bold transition-all" type="submit">send</button>
                </div>
            </div>
        </form>`;
};
const replyTemplate = (content, createdAt, replyingTo, id, score, image, username) => {
    return `
        <!-- user profile -->
        <div class="user-profile md:col-start-2 md:col-end-4 row-start-1 row-end-2 col-start-1 col-end-5 flex items-center gap-2">
            <div class="max-w-[2.25rem]">
                <a class="block" href=""><img class="w-100" src="${image}" alt="${username} profile picture"></a>
            </div>
            <h2 class="username text-blue-200 font-bold">${username}</h2>
            <span>${timeConversion(createdAt)}</span>
        </div>

        <!-- content -->
        <div class="md:row-start-2 md:row-end-5 md:col-start-2 md:col-end-5 row-start-2 row-end-3 col-start-1 col-end-5">
            <p>${mentioned(content, replyingTo)}</p>
        </div>

        <!-- score -->
        <div class="md:row-start-1 md:row-span-full row-start-3 row-end-4 col-start-1 col-end-2">
            <div class="md:flex-col flex items-center gap-2 bg-gray-200 w-fit rounded">
                <button class="reply-comment-plus-score-btn plus-score-btn animations-svg-blue-opp flex justify-center items-center md:px-3 md:pt-3 md:pb-1 py-2 pr-1 pl-3 block" type="button">
                    <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                </button>
                <span class="score-count text-blue-200 font-bold">${score}</span>
                <button class="reply-comment-minus-score-btn minus-score-btn animations-svg-blue-opp flex justify-center items-center md:px-3 md:pt-1 md:pb-4 py-2 pl-1 pr-3 block" type="button">
                    <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                </button>
            </div>
        </div>

        <!-- reply -->
        <div class="md:row-start-1 md:row-end-2 row-start-3 row-end-4 col-start-4 col-end-5 flex items-center justify-right">
            <button class="replies-reply-btn animation-svg-blue transition-all  flex items-center gap-1 font-bold hover:text-blue-100 text-blue-200" type="button">
                <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                Reply
            </button>
        </div>
    `;
};
const currentUserReplyTemplate = (content, createdAt, replyingTo, id, score, image, username) => {
    return `
        <!-- user profile -->
        <div class="user-profile md:col-start-2 md:col-end-4 row-start-1 row-end-2 col-start-1 col-end-5 flex items-center gap-2">
            <div class="max-w-[2.25rem]">
                <a class="block" href=""><img class="w-100" src="${image}" alt="${username} profile picture"></a>
            </div>
            <h2 class="username text-blue-200 font-bold">${username}</h2>
            <span class="px-2 pb-1 rounded bg-blue-200 text-white text-sm font-medium">you</span>
            <span>${timeConversion(createdAt)}</span>
        </div>

        <!-- content -->
        <div class="content md:row-start-2 md:row-end-5 md:col-start-2 md:col-end-5 row-start-2 row-end-3 col-start-1 col-end-5">
            <p>${mentioned(content, replyingTo)}</p>
        </div>

        <!-- score -->
        <div class="md:row-start-1 md:row-span-full row-start-3 row-end-4 col-start-1 col-end-2">
            <div class="md:flex-col flex items-center gap-2 bg-gray-200 w-fit rounded">
                <button class="reply-comment-plus-score-btn plus-score-btn animations-svg-blue-opp transition-all flex justify-center items-center md:px-3 md:pt-3 md:pb-1 py-2 pr-1 pl-3 block" type="button">
                    <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                </button>
                <span class="score-count text-blue-200 font-bold">${score}</span>
                <button class="reply-comment-minus-score-btn minus-score-btn animations-svg-blue-opp transition-all flex justify-center items-center md:px-3 md:pt-1 md:pb-4 py-2 pl-1 pr-3 block" type="button">
                    <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                </button>
            </div>
        </div>

        <!-- reply -->
        <div class="md:row-start-1 md:row-end-2 row-start-3 row-end-4 col-start-4 col-end-5 flex items-center justify-right md:gap-8 gap-4">
            <button class="delete-button animations-svg-red flex items-center gap-1 font-bold hover:text-red-100 text-red-200 transition-all" type="button">
                <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
                Delete
            </button>
            <button class="edit-button animation-svg-blue flex items-center gap-1 font-bold hover:text-blue-100 text-blue-200 transition-all" type="button">
                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path class="transition-all" d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
                Edit
            </button>
        </div>
    `;
};

/* ADDING COMMENTS AND REPLIES DYNAMICALLY */
commentsData.forEach(commentData => {

    // comment
    const comment = document.createElement('div');
    comment.setAttribute('class', 'comment-container grid md:gap-4 gap-2');
    comment.setAttribute('data-id', commentData.id);
    comment.innerHTML = commentsTemplate(commentData.content, commentData.createdAt, commentData.id, commentData.score, commentData.user.image.webp, commentData.user.username);

    const repliesContainer = comment.querySelector('.replies-container');
    const repliesWrapper = comment.querySelector('.replies-wrapper');
    
    /* APPEND REPLIES */
    if(commentData.replies.length > 0) {
        commentData.replies.forEach(replyData => {

            const replyComment = document.createElement('article');
            replyComment.setAttribute('class', 'reply-comment w-[95%] ml-auto comment-grid md:gap-4 gap-3 bg-white md:p-8 p-4 rounded shadow-sm');
            replyComment.setAttribute('data-id', replyData.id);

            if(currentUser.username !== replyData.user.username) {
                replyComment.innerHTML = replyTemplate(replyData.content, replyData.createdAt, replyData.replyingTo, replyData.id, replyData.score, replyData.user.image.webp, replyData.user.username);
            } else {
                replyComment.innerHTML = currentUserReplyTemplate(replyData.content, replyData.createdAt, replyData.replyingTo, replyData.id, replyData.score, replyData.user.image.webp, replyData.user.username);
            };

            repliesWrapper.appendChild(replyComment);
            repliesContainer.appendChild(repliesWrapper);
            repliesContainer.classList.remove('hidden');
        });
    };

    /* APPEND COMMENT */
    const commentsContainer = document.querySelector('.comments-container');
    commentsContainer.appendChild(comment);
});

/* SHOW FORM */
const showForm = (btn) => {
    const commentContainer = btn.closest('.comment-container');
    const formContainer = commentContainer.querySelector('.form-container');
    const formWrapper = commentContainer.querySelector('.form-wrapper');
    const formWrapperHeight = formWrapper.getBoundingClientRect().height;

    forms.forEach(form => {
        if(formContainer !== form) {
            form.style.height = 0;
            form.classList.remove('md:mb-4','mb-2');
        } else {
            form.style.height = `${formWrapperHeight}px`;
            form.classList.add('md:mb-4','mb-2');

            window.scrollTo({
                top: form.offsetTop - 200,
                left: 0,
                behavior: "smooth"
            });
        };
    });
};

const commentReplyButtons = document.querySelectorAll('.comment-reply-btn');
const repliesReplyButtons = document.querySelectorAll('.replies-reply-btn');
const forms = document.querySelectorAll('.form-container');


/* INITIAL VARIABLES FOR STORING REPLIES */
let commentID;
let replyingToUsername = ''; /* username */

/* REPLIES FUNCTIONALITIES */
/* content, createdAt, id, score, image, username */
commentReplyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        showForm(btn)
        const mainComment = btn.closest('.main-comment');
        const comment = mainComment.closest('.comment-container');
        const formTextArea = comment.querySelector('.form-container textarea');
        const username = mainComment.querySelector('.user-profile .username');

        commentID = comment.dataset.id;
        replyingToUsername = username.textContent;

        formTextArea.value = `@${replyingToUsername} `;
    });
});
repliesReplyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        showForm(btn)
        const replyComment = btn.closest('.reply-comment');
        const comment = replyComment.closest('.comment-container');
        const formTextArea = comment.querySelector('.form-container textarea');
        const username = replyComment.querySelector('.user-profile .username');

        commentID = comment.dataset.id;
        replyingToUsername = username.textContent;

        formTextArea.value = `@${replyingToUsername} `;
    });
});

/* APPEND NEW REPLY */
forms.forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const textArea = form.querySelector('textarea');

        if(textArea.value !== '') {
            const replyCreatedAt = new Date().getTime();
            const id = new Date().getTime();

            const replyComment = document.createElement('article');
            replyComment.setAttribute('class', 'reply-comment w-[95%] ml-auto comment-grid md:gap-4 gap-3 bg-white md:p-8 p-4 rounded shadow-sm');
            replyComment.setAttribute('data-id', id);
            replyComment.innerHTML = currentUserReplyTemplate(textArea.value, replyCreatedAt, replyingToUsername, id, 0, currentUser.image.webp, currentUser.username);

            const repliesContainer = form.closest('.comment-container').querySelector('.replies-container');
            const repliesWrapper = form.closest('.comment-container').querySelector('.replies-wrapper');
            repliesContainer.classList.remove('hidden'); 
            repliesWrapper.appendChild(replyComment);

            // SET UP LOCAL STORAGE
            const reply = new Reply(textArea.value, replyCreatedAt, id, replyingToUsername, 0, currentUser);
            saveReply(commentID, reply);

            textArea.value = `@${replyingToUsername} `;

            /* COMMENT SCORE FUNCTIONALITEIES */
            const commentScorePlusButtons = document.querySelectorAll('.comment-plus-score-btn');
            commentPlusButtons(commentScorePlusButtons);
            const commentScoreMinusButtons = document.querySelectorAll('.comment-minus-score-btn');
            commentMinusButtons(commentScoreMinusButtons);
            const replyCommentScorePlusButtons = document.querySelectorAll('.reply-comment-plus-score-btn');
            replyCommentPlusButtons(replyCommentScorePlusButtons);
            const replyCommentScoreMinusButtons = document.querySelectorAll('.reply-comment-minus-score-btn');
            replyCommentMinusButtons(replyCommentScoreMinusButtons);

            /* REPLIES FUNCTIONALITIES */
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteReply(deleteButtons);
            const editButtons = document.querySelectorAll('.edit-button');
            editReply(editButtons);

            /* HOVERS FUNCTIONALITIES */
            const svgsBlue = document.querySelectorAll('.animation-svg-blue');
            svgsBlueButtons(svgsBlue);
            const svgsBlueOpposite = document.querySelectorAll('.animations-svg-blue-opp');
            svgsBlueOppositeButtons(svgsBlueOpposite);
            const svgsRed = document.querySelectorAll('.animations-svg-red');
            svgsRedButtons(svgsRed);
        };

    });
});

/* COMMENT SCORE FUNCTIONALITEIES */
const commentScorePlusButtons = document.querySelectorAll('.comment-plus-score-btn');
commentPlusButtons(commentScorePlusButtons);
const commentScoreMinusButtons = document.querySelectorAll('.comment-minus-score-btn');
commentMinusButtons(commentScoreMinusButtons);
const replyCommentScorePlusButtons = document.querySelectorAll('.reply-comment-plus-score-btn');
replyCommentPlusButtons(replyCommentScorePlusButtons);
const replyCommentScoreMinusButtons = document.querySelectorAll('.reply-comment-minus-score-btn');
replyCommentMinusButtons(replyCommentScoreMinusButtons);

/* REPLIES FUNCTIONALITIES */
const deleteButtons = document.querySelectorAll('.delete-button');
deleteReply(deleteButtons);
const editButtons = document.querySelectorAll('.edit-button');
editReply(editButtons);

/* HOVERS */
const svgsBlue = document.querySelectorAll('.animation-svg-blue');
svgsBlueButtons(svgsBlue);
const svgsBlueOpposite = document.querySelectorAll('.animations-svg-blue-opp');
svgsBlueOppositeButtons(svgsBlueOpposite);
const svgsRed = document.querySelectorAll('.animations-svg-red');
svgsRedButtons(svgsRed);