init = function(){
  photo_wrap = document.querySelector("#photo_wrap");
  tag = document.querySelector("#tag");
  next = document.querySelector("#next");
  controls = document.querySelector("#controls");
  help = document.querySelector("#help");
  url = alert("CHANGE THIS TO THE STATISTICS URL");;
  sexEl = document.querySelector("#sex");
  hasUploaded = false;
  sex = "M";
  scales ={};
  Array.from(controls.querySelectorAll(".button")).forEach((e)=>{
    scales[e.id] = e;
    e.onclick = function(){
      e.setAttribute("data-selected",!(e.getAttribute("data-selected") == "true"))
    }
  });
  DATA = {
    F:{},
    M:{}
  }
  fetch("allPairs.json").then((d)=>{
    d.json().then((data)=>{
      console.log("images urls loaded...");
      window.imgs = [];
      imgpromises = [];
      window.pairs = data;
      img_index = 0;
      for(var key in pairs){
        for(var i in pairs[key]){
          imgpromises.push(new Promise((res,rej)=>{
          var im = new Image();
          im.src = "../oslo/"+pairs[key][i][0];
          DATA[key][pairs[key][i][0]] = {befriend:[],hookup:[],date:[]};
          window.imgs.push(im);
          im.onload = function(){
            img_index++;0
            help.innerHTML = "loading image: "+img_index+" of 40";
            res();
          } 
        }))
        };
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
  photo_wrap.style.backgroundImage = "url(../oslo/"+pairs[sex][index[sex]][0]+")";
  tag.innerText = pairs[sex][index[sex]][1];
  for(var name in scales){
    scales[name].setAttribute("data-selected","false");
  }
}

function upload(){
  return fetch(url,{
    method:"PUT",
    mode:"cors",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(DATA)
  }).then(()=>{
    console.log("uploaded!",Date());
  })
}

function main(){
  console.log("starting...");
  help.style.display = "none";
  index = {M:0,F:0};
  nextProfile();
  next.onclick = function(){
    for(var name in scales){
      DATA[sex][pairs[sex][index[sex]][0]][name].push(Number(scales[name].getAttribute("data-selected") == "true"));
    }
    index[sex] = (index[sex]+1)%20;
    upload().then(nextProfile);
    //nextProfile();
  }
  
  sexEl.onclick = function(){
    if(sexEl.getAttribute("data-sex") == "M"){
      sexEl.setAttribute("data-sex","F");
      sexEl.innerText = "FEMALE";
    } else {
      sexEl.setAttribute("data-sex","M");
      sexEl.innerText = "MALE";
    }
    sex = sexEl.getAttribute("data-sex");
    nextProfile();
  }
}