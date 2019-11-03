#!/usr/bin/node

const fs = require('fs');
const http = require('http');
const url = require('url');
const qs = require('querystring');
var log  = console.log;

var userList = [
  {username:'admin',pwd:'admin'}
];

var chapterList = JSON.parse(fs.readFileSync('./js/data.js','utf8'));

http.createServer((req,res)=>{
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');
  
  if(req.method === 'GET'){
      select(req,res);
  }
  else if(req.method === 'POST'){
      create(req,res);
  }
  else{
      process.exit();
  }
  
}).listen(8083);

function select(req,res){
  var file = __dirname;
  if(req.url === '/listmanager/bg.jpg'){
    log(req.url);
  }
 
  //切换不同的页面
  if(req.url === '/list/'){
    file += '/chapterList.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode = 404;
        res.end(err.message);
      }else{
        //response.writeHead(响应状态码，响应头对象): 发送一个响应头给请求。
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(req.url === '/login/'){
    file += '/login.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode = 404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(req.url === '/listmanager/'){
    file += '/list.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode = 404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(req.url === '/addChapter/'){
    file += '/addChapter.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode = 404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(req.url.split('?')[0] === '/detail'){
    file += '/chapter.html';
    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode = 404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
    })
  }else if(req.url !=='/'){

    let listurl = req.url.split('?')[0];
    let listurls = listurl.split('/');
    for(var i =1 ;i<listurls.length;i++){
        if(listurls[i] === 'list' || listurls[i] ==='login'|| listurls[i] ==='listmanager' || listurls[i] === "addChapter")
          continue;
        else
        file =file+'/' +listurls[i];
    }

    fs.readFile(file,(err,data)=>{
      if(err){
        res.statusCode = 404;
        res.end(err.message);
      }else{
        res.writeHead(200,{'Content-Type':'text/css'});
        res.end(data);
      }
    })

  }

  if(req.url === '/getDetail/'){
    var index = qs.parse(req.headers.referer.split('?')[1]).chapterId-1;
    res.writeHead(200,{'Content-Type':'text/json'});
    res.end(JSON.stringify(chapterList[index]));
  }
  if(req.url === '/mylist/'){
    res.writeHead(200,{'Content-Type':'text/json'});
    res.end(JSON.stringify(chapterList));
  }
  
}

function create(req,res){
 
  var i = '';
  if(req.url == '/login/'){
  req.on('data',(data)=>{
    i += data;
  });
  req.on('end',()=>{
    i = JSON.parse(i);
    userList.forEach((person)=>{
      if(person.username == i.username && person.pwd == i.pwd){
        log('username',i.username);
        log('personname',person.username);
        log('成功');
        res.statusCode = 200;
        res.end('OK');
      };
  });
  res.statusCode = 404;
  res.end('no')
  })
  }
  if(req.url == '/add'){
    req.on('data',(data)=>{
      i += data;
    });
    req.on('end',()=>{
      i = qs.parse(i.toString('utf8'));
      var newText = new CreateText(i.title,i.content);
      chapterList.push(newText);
      fs.writeFileSync('./js/data.js',JSON.stringify(chapterList));
      
    })
    res.end('OK')
  }

}

function CreateText(chapterName,chapterContent,chapterId,imgPath,chapterDes,publishTimer,author,views){
  var newObject = new Object();
  newObject.chapterId = chapterList.length+1;
  newObject.chapterName = chapterName;
  newObject.imgPath = imgPath || undefined;
  newObject.chapterDes = chapterDes || undefined;
  newObject.chapterContent = chapterContent;
  newObject.publishTimer = new Date().getTime();
  newObject.author = author || undefined;
  newObject.views = views || undefined;
  return newObject;
}