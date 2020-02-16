init = function(){
  photo_wrap = document.querySelector("#photo_wrap");
  tag = document.querySelector("#tag");
  next = document.querySelector("#next");
  controls = document.querySelector("#controls");
  showCon = document.querySelector("#showCon");
  help = document.querySelector("#help");
  
  url = alert("CHANGE THIS TO AN UPLOAD URL");
  testurl = alert("CHANGE THIS TO A TEST UPLOAD URL");
  //url = "";
  //testurl = "";
  hasUploaded = false;
  ID=prompt("ID");
  preference = prompt("preference (enter 'm' or 'f')");
  scales ={};
  Array.from(controls.querySelectorAll("input")).forEach((e)=>{
    scales[e.name] = e;
  });
  DATA = {
    id:ID,
    data:{}
  }
  fetch(preference+"Pairs.json").then((d)=>{
    d.json().then((data)=>{
      console.log("images urls loaded...");
      window.imgs = [];
      imgpromises = [];
      window.pairs = data;
      img_index = 0;
      for(var i in pairs){
        imgpromises.push(new Promise((res,rej)=>{
          var im = new Image();
          im.src = "oslo/"+pairs[i][0];
          window.imgs.push(im);
          im.onload = function(){
            img_index++;0
            help.innerHTML = "loading image: "+img_index+" of 20";
            res();
          } 
        }));
      }
      Promise.all(imgpromises).then(()=>{
        console.log("images loaded...")
        main();
      })
    })
  })
}
window.onload = init;

function nextProfile(p){
  photo_wrap.style.backgroundImage = "url(oslo/"+pairs[index][0]+")";
  tag.innerText = pairs[index][1];
  for(var name in scales){
    scales[name].value = "0";
  }
}

function upload(){
  all_data = {};
  fetch(url).then((d)=>{
    d.json().then((data)=>{
      all_data = data;
      all_data.push(DATA);
      fetch(url,{
        method:"PUT",
        mode:"cors",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(all_data)
      }).then(()=>{
        hasUploaded = true;
        alert("uploaded!");
        window.close();
      })
    })
  })
}

function main(){
  console.log("starting...");
  help.style.display = "none";
  index = 0;
  nextProfile();
  next.onclick = function(){
    if(!controls.classList.contains("hidden") && index < 19){
      var d = {};
      for(var name in scales){
        d[name] = Number(scales[name].value);
      }
      DATA.data[pairs[index][0]] = d;
      index++;
      nextProfile();
      controls.classList.toggle("hidden");
      next.classList.toggle("hidden");
    } else if (index >= 19 && !hasUploaded){
      var d = {};
      for(var name in scales){
        d[name] = Number(scales[name].value);
      }
      DATA.data[pairs[index][0]] = d;
      var toUpload = false;
      while(toUpload != "upload" && toUpload != "test"){
        toUpload = prompt("raise hand for assistance");
        if(toUpload == "upload"){
          upload();
        } else if(toUpload == "test"){
          url = testurl;
          upload();
        }
      }
    }
  }
  
  showCon.onclick = ()=>{controls.classList.toggle("hidden"); next.classList.toggle("hidden")};
}