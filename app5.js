const express = require("express");
const app = express();
//const path = require("pass");

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

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
  let win = Number( req.query.win )|| 0;
  let total = Number( req.query.total )|| 0;
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  if ((hand == 'グー' && cpu == 'チョキ') || 
    (hand == 'チョキ' && cpu == 'パー') || 
    (hand == 'パー' && cpu == 'グー')) {
  judgement = '勝ち';
  win += 1;
} else if (hand === cpu) {
  judgement = '引き分け';
} else {
  judgement = '負け';
}
total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total,
  }
  res.render( 'janken', display );
});



app.get("/kazuate", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win )|| 0;
  let total = Number( req.query.total )|| 0;
  //if (!hand){
  //  return res.sendFile(path.join(__dirname, "public", "kazuate.html"))
  //}


  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 5 + 1 );
  let cpu = '';
  if( num==1 ) cpu = '1';
  else if( num==2 ) cpu = '2';
  else if( num==3 ) cpu = '3';
  else if( num==4 ) cpu = '4';
  else cpu = '5';
  // ここに勝敗の判定を入れる
  if ((hand == '偶数' && cpu == '2')||
    (hand == '奇数' && cpu == '3') ||
    (hand == '奇数' && cpu == '1') ||
    (hand == '奇数' && cpu == '5') ||
    (hand == '偶数' && cpu == '4') ) { 
  judgement = 'アタリ';
  win += 1;
} else {
  judgement = 'ハズレ';
}
total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total,
  }
  res.render( 'kazuate', display );
});
 


app.get("/koin", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win )|| 0;
  let total = Number( req.query.total )|| 0;
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 2 + 1 );
  let cpu = '';
  if( num==1 ) cpu = '表';

  else cpu = '裏';
  // ここに勝敗の判定を入れる
  if ((hand == '表' && cpu == '表') || 
    (hand == '裏' && cpu == '裏') ) { 
  judgement = 'アタリ';
  win += 1;
} else {
  judgement = 'ハズレ';
}
total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total,
  }
  res.render( 'koin', display );
});







app.get("/koin2", (req, res) => {

  let win = Number( req.query.win )
  let total = Number( req.query.total )
  console.log( { win, total});
  const num = Math.floor( Math.random() * 2 + 1 );
  let cpu = '';
  if( num==1 ) cpu = '表';
  else cpu = '裏';


  if(( req.query.test1 == '表' && cpu == '表'),( req.query.test2== '裏' && cpu == '裏')){
    judgement = 'アタリ'; // 1番目の項目がチェックされていたときの処理 
  } else {
    judgement = 'ハズレ';
  }
  //if(( req.query.test2== '裏' && cpu == '裏')){
  //  judgement = 'アタリ';// 1番目の項目がチェックされていたときの処理 
  //} else {
  //  judgement = 'ハズレ';
  //} 
total += 1;

  const display = {
    
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total,
  }
  res.render( 'koin2', display );


});




app.listen(8080, () => console.log("Example app listening on port 8080!"));
