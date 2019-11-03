window.onload = function(){
  var login = document.getElementById('login');
  var username = document.getElementById('username');
  var pwd = document.getElementById('pwd');
  var arrlist = {};

  login.onclick=function(){
      arrlist.username = username.value;
      arrlist.pwd = pwd.value;
      arrlist = JSON.stringify(arrlist);
      fetch('http://localhost:8083/login/',{
        method : 'POST',
        body : arrlist,
        headers : new Headers({
          'Content-Type':'application/json'
        })
      })
      .then(res=>{
        if(res.status === 200){
          window.location = 'http://localhost:8083/listmanager/'
        }else{
          window.location = 'http://localhost:8083/login/'
        }
      })
  }
}