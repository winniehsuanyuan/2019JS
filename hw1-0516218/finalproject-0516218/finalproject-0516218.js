/* purpose: finalproject-0516218.html */
"use strict"; 
const planeHeight=500, planeWidth=900, planeRadius=20, mid_x=planeWidth/2, mid_y=planeHeight/2,
      holeWidth=150, 
      paddleRadius=20, paddleColor=["red", "blue"], p1reset_x=paddleRadius, preset_y=planeHeight/2, p2reset_x=planeWidth-planeRadius,  
      ballRadius=15,
      dir=[-1, 1],
      gameTime=2*60;
var ball_x=mid_x, ball_y=mid_y, ball_dx=0, ball_dy=0,
    p1_x=p1reset_x, p1_y=preset_y, p2_x=p2reset_x, p2_y=preset_y,
    p1=0, p2=0,
    p1_left=false, p1_right=false, p1_up=false, p1_down=false, p2_left=false, p2_right=false, p2_up=false, p2_down=false,
    p1_go=false, p2_go=false,
    game_time=gameTime, start=false,
    mouse_x=0, mouse_y=0, len=0,
    animate, countDown;

window.onload=function(){

  /*time*/
  let time_div=document.createElement("div");
  document.body.appendChild(time_div);
  let time_h2=document.createElement("h2");
  time_div.appendChild(time_h2);
  let time=document.createTextNode("");
  time_h2.appendChild(time);
  showTime();

    /*plane*/
    let container=document.createElement("div");
    container.id="container";
    document.body.appendChild(container);
    let plane=document.createElement("canvas");
    plane.width=planeWidth;
    plane.height=planeHeight;
    container.appendChild(plane);
    let c=plane.getContext("2d");

  /*restart*/
  let restart_div=document.createElement("div");
  restart_div.id="restart_div";
  restart_div.style.display="none";
  document.body.appendChild(restart_div);
  let restart_h2=document.createElement("h2");
  restart_h2.id="restart_h2";
  restart_div.appendChild(restart_h2);
  let restart=document.createTextNode("Press space to restart ...");
  restart_h2.appendChild(restart);

  /*draw plane*/
  function Plane(){
    //plane: 圓角矩形
    c.shadowOffsetx=0;
    c.shadowOffsety=0;
    c.shadowBlur=0;
    c.fillStyle="white";
    c.beginPath();
    c.moveTo(planeRadius, 0); c.lineTo(planeWidth-planeRadius, 0);
    c.arc(planeWidth-planeRadius, planeRadius, planeRadius, Math.PI*3/2, 0, false);
    c.lineTo(planeWidth, planeHeight-planeRadius);
    c.arc(planeWidth-planeRadius, planeHeight-planeRadius, planeRadius, 0, Math.PI/2, false);
    c.lineTo(planeRadius, planeHeight);
    c.arc(planeRadius, planeHeight-planeRadius, planeRadius, Math.PI/2, Math.PI, false);
    c.lineTo(0, planeRadius);
    c.arc(planeRadius, planeRadius, planeRadius, Math.PI, Math.PI*3/2, false);
    c.fill();
    c.closePath();

    //場中虛線
    c.lineWidth=4;
    c.strokeStyle="#341539";
    c.beginPath();
    for(let i=0;i<17;i++){
       c.moveTo(mid_x, 30*i);
       c.lineTo(mid_x, 30*i+20);
    }
    c.stroke();
    c.closePath();

    //得分洞
    //p1 hole
    c.lineWidth=10;
    c.strokeStyle="#341539";
    c.beginPath();
    c.moveTo(0, mid_y-holeWidth/2);
    c.lineTo(0, mid_y+holeWidth/2);
    c.stroke();
    c.closePath();
    c.strokeStyle="red";
    c.lineWidth=4;
    c.beginPath();
    c.arc(0, mid_y, holeWidth/2, Math.PI*3/2, Math.PI/2, false);
    c.stroke();
    c.closePath();
    //p2 hole
    c.lineWidth=10;
    c.strokeStyle="#341539";
    c.beginPath();
    c.moveTo(planeWidth, mid_y-holeWidth/2);
    c.lineTo(planeWidth, mid_y+holeWidth/2);
    c.stroke();
    c.closePath();
    c.strokeStyle="blue";
    c.lineWidth=4;
    c.beginPath();
    c.arc(planeWidth, mid_y, holeWidth/2, Math.PI*3/2, Math.PI/2, true);
    c.stroke();
    c.closePath();

    //score
    c.font = "300px Krungthep, Helvetica, sans-serif";
    //p1 score
    c.fillStyle = "rgba(255, 0, 0, 0.2)";
    c.fillText(p1, 150, 360);
    //p2 score
    c.fillStyle = "rgba(0, 0, 255, 0.2)";
    c.fillText(p2, 550, 360);
  }

  /*draw ball*/
  function Ball(){
    c.shadowColor="#999999";
    c.shadowOffsetx=5;
    c.shadowOffsety=5;
    c.shadowBlur=10;
    c.fillStyle="orange";
    c.beginPath();
    c.arc(ball_x, ball_y, ballRadius, 0, Math.PI*2, true);
    c.fill();
    c.closePath();
  } 
  
  /*draw paddles*/
  function Paddle(x, y, player){
    c.fillStyle=paddleColor[player];
    c.shadowOffsetx=0;
    c.shadowOffsety=0;
    c.shadowBlur=0;
    c.beginPath();
    c.arc(x, y, paddleRadius, 0, Math.PI*2, true);
    c.fill();
    c.closePath();
    //握把
    c.shadowColor="#999999";
    c.shadowOffsetx=5;
    c.shadowOffsety=5;
    c.shadowBlur=10;
    c.beginPath();
    c.arc(x, y, paddleRadius-12, 0, Math.PI*2, true);
    c.fill();
    c.closePath();
  }

  /*paddle movement & start & restart*/
  document.addEventListener("keydown", function(e){
    e=e||window.event;
    //p2 
    if(e.key=="ArrowLeft"){
        p2_left=true;
    }else if(e.key=="ArrowRight"){
        p2_right=true;
    }else if(e.key=="ArrowUp"){
        p2_up=true;
    }else if(e.key=="ArrowDown"){
        p2_down=true;
    }
    //p1 
    if(e.key=="a"){
        p1_left=true;
    }else if(e.key=="d"){
        p1_right=true;
    }else if(e.key=="w"){
        p1_up=true;
    }else if(e.key=="s"){
        p1_down=true;
    }
    //start & restart
    if(e.code=="Space"){
      if(game_time>0 && start==false){//start
        start=true;
        ball_dx=dir[rand(0, 1)]*rand(3, 7);//initialization
        ball_dy=dir[rand(0, 1)]*rand(3, 7);
        countDown=setInterval(timer, 1000);
      }else if(game_time<=0 && start==true){//restart
        c.restore();
        game_time=gameTime;
        showTime();
        p1=0;
        p2=0;
        ball_x=mid_x;
        ball_y=mid_y;
        ball_dx=0;
        ball_dy=0;
        p1_x=p1reset_x;
        p1_y=preset_y;
        p2_x=p2reset_x;
        p2_y=preset_y;
        start=false;
        restart_div.style.display="none";
        draw();
      }  
    }
  });

  document.addEventListener("keyup", function(e){
    e=e||window.event;
    //p2 
    if(e.key=="ArrowLeft"){
        p2_left=false;
    }else if(e.key=="ArrowRight"){
        p2_right=false;
    }else if(e.key=="ArrowUp"){
        p2_up=false;
    }else if(e.key=="ArrowDown"){
        p2_down=false;
    }
    //p1
    if(e.key=="a"){
        p1_left=false;
    }else if(e.key=="d"){
        p1_right=false;
    }else if(e.key=="w"){
        p1_up=false;
    }else if(e.key=="s"){
        p1_down=false;
    }
  });
  
  /*serve ball*/
  //choose dir
  document.addEventListener("mousemove", function(e){
      if(p1_go || p2_go){
        e=e||window.event;
        mouse_x=e.pageX-(screen.width/2-mid_x)-ball_x;
        mouse_y=e.pageY-145-ball_y;
        len=Math.sqrt(mouse_x**2+mouse_y**2);
      }
  });
  //serve
  document.addEventListener("mousedown", function(e){
      if(p1_go || p2_go){
        e=e||window.event;
        let strength=rand(5,10);
        ball_dx=mouse_x*strength/len;
        ball_dy=mouse_y*strength/len;
        mouse_x=0;
        mouse_y=0;
        len=0;
        p1_go=false;
        p2_go=false;
      }
  });

  /*player score*/
  function score(player){
    if(player==0){//p1 wins 1 point p2 serve
       p1++;
       p2_go=true;
    }else if(player==1){//p2 wins 1 point p1 serve
       p2++;
       p1_go=true;
    }
    //reset
    ball_dx=0;
    ball_dy=0;
    p1_x=p1reset_x;
    p1_y=preset_y;
    p2_x=p2reset_x;
    p2_y=preset_y;
  }

  /*paddle hits the ball*/
  function hit(x, y){
    if((ball_x-x)**2+(ball_y-y)**2<(paddleRadius+ballRadius)**2){ //hit
      ball_x-=Math.ceil(ball_dx/2);
      ball_y-=Math.ceil(ball_dy/2);
      let normalx=ball_x-x, normaly=ball_y-y, normallen=Math.sqrt(normalx**2+normaly**2), 
      vectorlen=Math.sqrt(ball_dx**2+ball_dy**2), vectorx=ball_dx/vectorlen, vectory=ball_dy/vectorlen; //normalize
      normalx/=normallen; //normailize
      normaly/=normallen;
      let n_dot_i=normalx*vectorx+normaly*vectory;
      ball_dx=(vectorx-2*n_dot_i*normalx)*vectorlen; //reflect
      ball_dy=(vectory-2*n_dot_i*normaly)*vectorlen;
      return true;
    }
    else
      return false;
  }

  /*show time*/
  function showTime(){
    let sec=game_time%60;
    if(sec>9)
      time.nodeValue="0"+Math.floor(game_time/60)+" : "+sec;
    else
      time.nodeValue="0"+Math.floor(game_time/60)+" : 0"+sec;  
  }

  /*revised random function*/
  function rand(lower, upper){
    return Math.floor(Math.random()*(upper-lower+1)+lower);
  }

  /*count down timer*/
  function timer(){
    if(start){
     game_time-=1;
    }
    if(game_time>=0){
     showTime();
    }else{ 
      clearInterval(countDown);
      p1_go=false;
      p2_go=false;
    } 
  }

  /*main*/
  function draw(){
  	c.clearRect(0, 0, planeWidth, planeHeight);
  	Plane();
    Paddle(p1_x, p1_y, 0);
    Paddle(p2_x, p2_y, 1);
  	Ball();
    if(!start){
      //start instruction
      c.shadowOffsetx=0;
      c.shadowOffsety=0;
      c.shadowBlur=0;
      c.font = "italic 35px Krungthep";
      c.fillStyle = "rgba(50, 50, 50, 0.3)";
      c.fillText("Press space to start ...", planeWidth/4, 80);
      c.save();
    }
    /*ball movement*/
    ball_x+=ball_dx;
    ball_y+=ball_dy;

    /*check constraints*/
    //in hole
    if(ball_x<ballRadius && ball_y>mid_y-holeWidth/2+ballRadius && ball_y<mid_y+holeWidth/2-ballRadius){
      score(1);// in p1's hole p2 gets the point
    }else if(ball_x>planeWidth-ballRadius && ball_y>mid_y-holeWidth/2+ballRadius && ball_y<mid_y+holeWidth/2-ballRadius){
      score(0);// in p2's hole p1 gets the point
    
    //boundaries
    }else if(ball_x<ballRadius || ball_x>planeWidth-ballRadius || ball_y<ballRadius || ball_y>planeHeight-ballRadius){
      //right left
      if(ball_x<ballRadius){ 
        ball_x=ballRadius;
        ball_dx*=(-1);
      }else if(ball_x>planeWidth-ballRadius){
        ball_x=planeWidth-ballRadius;
        ball_dx*=(-1);
      }
      //top bottom
      if(ball_y<ballRadius){ 
        ball_y=ballRadius;
        ball_dy*=(-1);
      }else if(ball_y>planeHeight-ballRadius){
        ball_y=planeHeight-ballRadius;
        ball_dy*=(-1);
      }

    //paddle hit ball
    }else{
      if(!hit(p1_x, p1_y))//p1 hit
        hit(p2_x, p2_y);//p2 hit
    }

    /*paddle movement*/
    //p1
    if(!p2_go){//p2 serve -> p1 can't move
      if(p1_left){
        p1_x=Math.max(p1_x-5, paddleRadius);
      }else if(p1_right){
        p1_x=Math.min(p1_x+5, mid_x-paddleRadius); 
      }else if(p1_up){
        p1_y=Math.max(p1_y-5, paddleRadius); 
      }else if(p1_down){
        p1_y=Math.min(p1_y+5, planeHeight-paddleRadius);
      }
      if(p1_go){//p1 serve -> ball stick with p1
        ball_x=p1_x+paddleRadius+ballRadius;
        ball_y=p1_y;
      }
    }
    //p2
    if(!p1_go){//p1 serve -> p2 can't move
      if(p2_left){
        p2_x=Math.max(p2_x-5, mid_x+paddleRadius);
      }else if(p2_right){
        p2_x=Math.min(p2_x+5, planeWidth-paddleRadius);
      }else if(p2_up){
        p2_y=Math.max(p2_y-5, paddleRadius);
      }else if(p2_down){
        p2_y=Math.min(p2_y+5, planeHeight-paddleRadius);
      }
      if(p2_go){//p2 serve -> ball stick with p2
        ball_x=p2_x-paddleRadius-ballRadius;
        ball_y=p2_y;
      }
    }

    /*bg alert & draw serve direction*/
    if(p1_go || p2_go){
      c.lineWidth=4;
      c.strokeStyle="gray";
      c.beginPath();
      c.moveTo(ball_x, ball_y);
      c.lineTo(ball_x+mouse_x*70/len, ball_y+mouse_y*70/len);
      c.stroke();
      c.closePath();
      document.body.style.backgroundColor = "#341539";
    }else if(ball_x**2+(ball_y-mid_y)**2<(holeWidth/2)**2){
      document.body.style.backgroundColor = "red";
    }else if((ball_x-planeWidth)**2+(ball_y-mid_y)**2<(holeWidth/2)**2){
      document.body.style.backgroundColor = "blue";
    }else{
      document.body.style.backgroundColor = "#341539";
    }
   
    /*time*/   
    if(game_time>0)
      animate=requestAnimationFrame(draw);
    else{
      cancelAnimationFrame(animate);
      c.clearRect(0, 0, planeWidth, planeHeight);
      Plane();
      if(p1>p2){//p1 win
        c.translate(50, 480);
        c.rotate(-45 * Math.PI / 180);
        c.font = "italic 130px Krungthep";
        c.fillStyle = "red";
        c.fillText("WINNER", 0, 0);
        c.translate(400, 310);
        c.fillStyle = "blue";
        c.fillText("LOSER", 0, 0);
      }else if(p1<p2){//p2 win
        c.translate(120, 430);
        c.rotate(-45 * Math.PI / 180);
        c.font = "italic 130px Krungthep";
        c.fillStyle = "red";
        c.fillText("LOSER", 0, 0);
        c.translate(240, 310);
        c.fillStyle = "blue";
        c.fillText("WINNER", 0, 0);
      }else{//tie
        c.fillStyle="orange";
        c.beginPath();
        c.rect(0, mid_y-150, planeWidth, 300);
        c.fill();
        c.closePath();
        c.font = "italic 250px Krungthep";
        c.fillStyle = "red";
        c.fillText("TIE", 245, 350);
      }
      //restart instruction
      restart_div.style.display="block";
    }
  }
  
  draw();
}
