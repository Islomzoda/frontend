const apiUrl = 'https://islomzoda-backend.herokuapp.com/api/posts';

const rootEl = document.querySelector('#root');

rootEl.innerHTML = `
<form class="container mt-3" >
    <label for="input_content"><h2>Добавте новый контент посту:</h2></label>
    <input type="text" id="input_content" data-input="content_post" class="form-control">
    <button data-action="add_post" class="btn btn-outline-success mt-3">Добавить пост!</button>
    <button data-action="edit_post" class="btn btn-outline-warning btn-sm mt-3" style="display: none;">Изменить контент поста!</button>
    <ul data-id="posts-list"></ul>
    <img src="loader.gif" alt="" data-loading='progress'>
    <div style="color: red" data-error="error"></div>
</form>
`;
 
const listEl = rootEl.querySelector('[data-id=posts-list]');

const inputContent = rootEl.querySelector('[data-input=content_post]');
const btnAddPost = rootEl.querySelector('[data-action=add_post]');
const progress = rootEl.querySelector('[data-loading=progress]');
const btnEdditPost = rootEl.querySelector('[data-action=edit_post]');
const errorEl = rootEl.querySelector('[data-error=error]')

inputContent.focus()

let post = [];
getAllPosts();

const language = 'ru'
const translations = {
    ru: {
        'error.not_found': 'Объект не найден',
        'error.bad_request': 'Произошла ошибка, пожалуйста введите число', 
        'error.unknown': 'Произошла неизвестная ошибка', 
        'error.network': 'Проверьте своё соединение с интернетом', 
    },
    en: {
        'error.not_found': 'Object not found',
        'error.bad_request': 'Error occured',
        'error.unknown': 'Error occured',
        'error.network': 'Check internet connection',
    }
};
function translateError(code){
    return translations[language][code] || translations[language]['error.unknown'];
};

function getAllPosts (){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', apiUrl);
        progress.style = "display: block;"
        xhr.addEventListener('load', evt => {
            listEl.innerHTML='';
            const response = xhr.responseText;
            if(xhr.status >= 200 && xhr.status < 300){
                post = JSON.parse(response);
                post.map(o=>{
                    const postEl = document.createElement('li');

                    postEl.innerHTML = `id: ${o.id}, контент поста: ${o.content}<button data-action="edit" class="btn btn-outline-warning ml-2 btn-sm mt-1">Edit</button><button data-action="remove" class="btn btn-outline-danger mt-1 ml-2 btn-sm">X</button>`;
                    listEl.appendChild(postEl);

                    const btnEdit = postEl.querySelector('[data-action=edit]');

                    btnEdit.addEventListener('click', evt =>{
                        evt.preventDefault();
                        btnAddPost.style = "display: none";
                         btnEdditPost.style = "display: flex";
                        inputContent.focus();
                        btnEdditPost.onclick = function(evt){
                            evt.preventDefault();
                            const contentValue = inputContent.value;
                            const postForEddit = {id: o.id, content: contentValue};
                            editPost(postForEddit);
                            inputContent.value = '';
                            btnAddPost.style = "display: inline";
                            btnEdditPost.style = "display: none";
                        }
                    })
                    const btnRm = postEl.querySelector('[data-action=remove]');
                    btnRm.addEventListener('click', evt =>{
                        evt.preventDefault();
                        removePost(o.id);
                    })
                    
                })
                console.log(post);
            }else{
                const {error} = JSON.parse(response);
                errorEl.innerText = translateError(error);
            }

        });

        xhr.addEventListener('error', evt => {
            errorEl.innerText = translateError('error.network');
        });

        xhr.addEventListener('loadend', () => {
            progress.style = "display: none;"
        });
        xhr.send();
}

function editPost (post){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', evt=>{
        const response = xhr.responseText;
        if(xhr.status >= 200 && xhr.status < 300 ){
            getAllPosts();
            return;
        }
        const {error} = JSON.parse(response);
        errorEl.innerText = translateError(error);
    })
    xhr.addEventListener('error', evt => {
        errorEl.innerText = translateError('error.network');
    });
    xhr.send(JSON.stringify(post));
}

btnAddPost.addEventListener('click', evt =>{
    evt.preventDefault();
    const contentValue = inputContent.value;
    addPost({id:0, content: contentValue});
    inputContent.value = ''
})

function addPost (post){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener('load', evt =>{
        const response = xhr.responseText;
        if(xhr.status >= 200 && xhr.status < 300){
            getAllPosts();
            return;
        }
        const {error} = JSON.parse(response);
        errorEl.innerText = translateError(error);
    });
    xhr.addEventListener('error', evt => {
        errorEl.innerText = translateError('error.network');
    });
    xhr.send(JSON.stringify(post));
}


function removePost (postId){
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${apiUrl}/${postId}` );

    xhr.addEventListener('load', evt=>{
        const response = xhr.responseText;
        if(xhr.status >= 200 && xhr.status < 300){
                getAllPosts();
                return;
            }
        const {error} = JSON.parse(response);
        errorEl.innerText = translateError(error);
    });
    xhr.addEventListener('error', evt => {
        errorEl.innerText = translateError('error.network');
    });
    xhr.send();
} 





















// const apiUrl = 'https://islomzoda-backend.herokuapp.com/api/posts'

 

// const rootEl = document.getElementById('root');


// let posts = [];
// getAllPosts();

// rootEl.innerHTML = `
//     <form data-action="submit-form" class="ml-5">
//         <label for="category"><h2>Введитек новый контент</h2></label>
//         <input id="category" placeholder="Добават новый контент" data-id="content" class="form-control mt-4 mb-4 ml-4"/>
//         <button data-action="submit-but" class = "btn btn-outline-success mt-3">Добавит</button>
//     </form>
//     <ul data-id="item-list">
//     </ul>
// `;
// const submibFormEl = rootEl.querySelector('[data-action="submit-form"]');
// const likesInputEl = rootEl.querySelector('[data-id="likes"]');
// const contentElInput = rootEl.querySelector('[data-id="content"]');
// let itemList = rootEl.querySelector('[data-id="item-list"]');





// function sendRequest(method, url, body = null){
// return new Promise((resolve, reject) => {

//     const xhr = new XMLHttpRequest();

//     xhr.open(method, url);
//     xhr.setRequestHeader('Content-Type', 'application/json')
//     xhr.responseType = 'json';
    
//     xhr.onload = () => {
//         if (xhr >= 400) {
//             reject(xhr.response) 
//         } else 
//         {
//         resolve(xhr.response)
//     }
//     }
    
//     xhr.onerror = () => {
//         reject(xhr.response)
//     }

//     xhr.send(JSON.stringify(body))

// })

// }
// function getAllPosts() {
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', `${apiUrl}`);
//     xhr.addEventListener('load', evt => {
//         const response = xhr.responseText;
//         posts = JSON.parse(response);

//         posts.forEach(o => {
//             let itemListEl = document.createElement('li');
//             itemListEl.innerHTML = `
//              Ваш контент  ${o.content}
//             <button data-action="remove">X</button>
//             `;
//             itemList.appendChild(itemListEl);
//         })
//     });
//     xhr.send();
// }

// const removeButtonEl = itemListEl.querySelector('[data-action=remove]');


// removeButtonEl.onclick = () => {
//     removeButtonEl.removeButtonEl();
// }


// function addPost() {
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', `${apiUrl}`)
//     xhr.setRequestHeader('Content-Type', 'application/json')

//     const content = inputContnetEl.value;

//     let post = {
//         id: o.id,
//         content: o.content,
//     };

//     xhr.send(JSON.stringify(post));
// }

// submibFormEl.addEventListener("submit", evt => {
//     evt.preventDefault();
//     addPost();
// });



// function removePost(id){
//     const xhr = new XMLHttpRequest();
//     xhr.open('DELETE', `${apiUrl}/${id}`);
//     xhr.add

// }