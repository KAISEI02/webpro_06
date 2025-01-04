"use strict";

let number=0;
const bbs = document.querySelector('#bbs');
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;
    const date = document.querySelector('#date').value; // 日付を取得

    const params = {  // URL Encode
        method: "POST",
        body:  'name='+name+'&message='+message + '&date=' + date,//日付を追加
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log( params );
    const url = "/post";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        console.log( response );
        document.querySelector('#message').value = "";
        document.querySelector('#date').value = "";//日付もリセット
    });
});

document.querySelector('#check').addEventListener('click', () => {






    const params = {  // URL Encode
        method: "POST",
        body:  '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error(`サーバーエラー: ${response.status}`);
        }
        return response.json();
    })
    .then( (response) => {
        let value = response.number;
        console.log("サーバーからの投稿数:", value );


        if (number !== value) {
            fetchPosts(value - number); // 新規投稿を取得する関数を呼び出す
        }
    })
    .catch((error) => {
        console.error("チェックリクエストに失敗しました:", error);
    });
});

       // 新規投稿を取得する関数
function fetchPosts(count) {
    const params = {
        method: "POST",
        body: `start=${number}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };


            const url = "/read";
            fetch( url, params )
            .then( (response) => {
                if( !response.ok ) {
                    throw new Error(`投稿取得エラー: ${response.status}`);
                }
                return response.json();
            })
            .then( (response) => {
                number += response.messages.length;
                for( let mes of response.messages ) {
                    addPostToDOM(mes); // 投稿をDOMに追加する関数
                }
            })
            .catch((error) => {
                console.error("投稿取得リクエストに失敗しました:", error);
            });
    }



                   //console.log( mes );  // 表示する投稿
                    function addPostToDOM(mes) {//// 投稿をDOMに追加する関数

                    let cover = document.createElement('div');
                    cover.className = 'cover';
                    cover.dataset.id = mes.id; // サーバー側から受け取った投稿IDを設定


                    let name_area = document.createElement('span');
                    name_area.className = 'name';
                    name_area.innerText = mes.name;


                    let date_area = document.createElement('span'); // 日付用のエリア
                    date_area.className = 'date';
                    date_area.innerText = mes.date || '日付未設定';//日付がない時の処理 


                    let mes_area = document.createElement('span');
                    mes_area.className = 'mes';
                    mes_area.innerText = mes.message;

                    
                    let delete_button = document.createElement('button'); // 削除ボタン追加
                    delete_button.innerText = '削除';
                    delete_button.className = 'delete-button';
                    delete_button.addEventListener('click', () => {
                        const id = cover.dataset.id; // 投稿IDを取得
                        deletePost(id, cover); // 削除リクエストを送信
                    });


                    // いいねボタンとカウントの追加
                    let like_button = document.createElement('button');
                    like_button.className = 'like-button';
                    like_button.innerText = `👍 ${mes.likes || 0}`; // 初期値0
                    like_button.addEventListener('click', () => {
                        likePost(mes.id, like_button);
                    });










                    cover.appendChild( name_area );

                    cover.appendChild(date_area);//日付を横に追加

                    cover.appendChild( mes_area );
                    
                    cover.appendChild(delete_button); // 削除ボタンを追加

                    cover.appendChild(like_button);//いいねボタン

                    bbs.appendChild( cover );
                }
  


// 投稿削除リクエスト
function deletePost(id, coverElement) {
    const params = {
        method: "POST",
        body: '' ,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = `/delete/${encodeURIComponent(id)}`; // 削除用のエンドポイント
    fetch(url, params)
    .then(response => {
        if (!response.ok) throw new Error('Error');
        return response.json();
    })
    .then(response => {
        if (response.success) {
            coverElement.remove(); // DOMから削除
        } else {
            console.error('削除に失敗しました');
        }
    })
    .catch(error => {
        console.error('削除リクエストに失敗しました:', error);
    });
}


//いいねボタンのリクエスト送信
function likePost(id, likeButton) {
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    const url = `/like/${id}`;
    fetch(url, params)
        .then(response => {
            if (!response.ok) {
                throw new Error('いいねに失敗しました。');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                likeButton.innerText = `👍 ${data.likes}`; // カウントを更新
            } else {
                console.error('いいね処理エラー:', data.message);
            }
        })
        .catch(error => {
            console.error('いいねリクエストエラー:', error);
        });
}