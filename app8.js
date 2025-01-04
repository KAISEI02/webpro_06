"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});











/////////////////////////////////////////////////////////////////////////////////////////////////




// これより下はBBS関係
app.post("/check", (req, res) => {//BBSに投稿数を取得
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {// BBSの投稿を読み取る
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

app.post("/post", (req, res) => {// BBSに新規投稿を追加
  const name = req.body.name;
  const message = req.body.message;

  const date = req.body.date;//日付追加

  console.log( [name, message,date] );//日付追加　dateのこと

 
  // 本来はここでDBMSに保存する
  const id = bbs.length > 0 ? bbs[bbs.length - 1].id + 1 : 1; // 新規投稿ID生成
  bbs.push({ id: id, name: name, message: message, date: date ,likes: 0 });
  //bbs.push( { id: bbs.length, name: name, message: message, date: date} );//日付追加dateのこと id: bbs.lengthは削除するIDのこと
  res.json( {number: bbs.length } );
});


app.get("/bbs", (req,res) => {//BBSを取得しHTTPに　Getリクエストを処理
    console.log("GET /BBS");
    res.json( {test: "GET /BBS" });
});

app.post("/bbs", (req,res) => {//投稿を作成するルート
    console.log("POST /BBS");
    res.json( {test: "POST /BBS"});
})

app.get("/bbs/:id", (req,res) => {//投稿idの取得　idはURL内のパラメータ
    console.log( "GET /BBS/" + req.params.id );
    res.json( {test: "GET /BBS/" + req.params.id });
});

app.put("/bbs/:id", (req,res) => {//特定の投稿IDの更新
    console.log( "PUT /BBS/" + req.params.id );
    res.json( {test: "PUT /BBS/" + req.params.id });
});

//app.delete("/bbs/:id", (req,res) => {//IDの削除
    //console.log( "DELETE /BBS/" + req.params.id );
  //  res.json( {test: "DELETE /BBS/" + req.params.id });
//});

app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id); // IDを取得
  const index = bbs.findIndex(post => post.id === id); // 投稿を検索
  if (index !== -1) {
      bbs.splice(index, 1); // 該当の投稿を削除
      res.json({ success: true, message: "投稿を削除しました。" });
  } else {
      res.status(400).json({ success: false, message: "無効なIDです。" });
  }
});

//いいねのエンドポイント
app.post("/like/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = bbs.find(p => p.id === id); // 対象投稿を検索
  if (post) {
      post.likes = (post.likes || 0) + 1; // いいねカウントを増加
      res.json({ success: true, likes: post.likes });
  } else {
      res.status(400).json({ success: false, message: "投稿が見つかりません。" });
  }
});





app.listen(8080, () => console.log("Example app listening on port 8080!"));
