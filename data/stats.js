statsInit = function(){
  canvas = document.querySelector("#canvas");
  canvas.width = canvas.height = Math.min(window.innerWidth/2,window.innerHeight);
  ctx = canvas.getContext("2d");
  angle = 0.5;
  dangle = 0;
  speed = 0.0003;
  url = alert("CHANGE THIS TO THE STATISTICS URL");;
  s = {
    befriend: {M:{count:0,num:0},F:{count:0,num:0}},
    hookup: {M:{count:0,num:0},F:{count:0,num:0}},
    date: {M:{count:0,num:0},F:{count:0,num:0}},
  }
  
  cats = ['befriend','hookup','date'];
  
  DATA = {};
  getStats = function(){
    for(var sex in DATA){
      for(var cat in s){
        s[cat][sex]['count'] = 0;
        s[cat][sex]['num'] = 0;
      }
      
      for(var pic in DATA[sex]){
        for(var cat in DATA[sex][pic]){
          s[cat][sex]['count'] += DATA[sex][pic][cat].length;
          s[cat][sex]['num'] += (DATA[sex][pic][cat].length > 0)? DATA[sex][pic][cat].reduce((a,b)=>{return a+b}) : 0;
        }
      }
    }
  }
  
  
  render = function(){
    anim = requestAnimationFrame(render);
    dt = Date.now() - t;
    t = Date.now();
    ddangle = Math.sign(angle-dangle)*dt*speed;
    if(dangle < angle && ddangle + dangle > angle){
      dangle = angle;
    } else if(dangle > angle && ddangle + dangle < angle){
      dangle = angle;
    } else {
      dangle += ddangle;
    }
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,canvas.width/4,0,Math.PI*2);
    ctx.fillStyle = "hsl(200,50%,50%)";
    ctx.fill();
    
   angle_start = -dangle/2 * Math.PI*2;
    angle_end = dangle/2 * Math.PI*2;
    ctx.beginPath();
   ctx.moveTo(canvas.width/2,canvas.height/2);
    ctx.arc(canvas.width/2,canvas.height/2,canvas.width/4,angle_start,angle_end);
    ctx.closePath();
    ctx.fillStyle = "hsl(0,50%,50%)";
    ctx.fill();
  }
  t = Date.now();
  render();
  
 get = function(){
  all_data = {};
  fetch(url).then((d)=>{
    d.json().then((data)=>{
      DATA = data;
      getStats();
      c_cycle();
    })
  }).then(()=>{
    get_anim = setTimeout(get,5000);
  })
}
 c_index = 0;
 c_cycle = function(){
   var c = cats[c_index];
   document.querySelector("#cat").innerText = c;
   var sum = (s[c].F.num/s[c].F.count || 0) + (s[c].M.num/s[c].M.count || 0);
   angle = s[c].F.num/s[c].F.count / sum;
   if(isNaN(angle)){
     angle = 0.5;
   }
   if(isNaN(dangle)){
     dangle = 0;
   }
   document.querySelector("#female").innerText = (angle*100).toFixed(1);
   document.querySelector("#male").innerText = ((1-angle)*100).toFixed(1);
   c_index = (c_index+1)%3;
 }
 get();
 
}