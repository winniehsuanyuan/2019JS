/* purpose: hw4-0516218-軒轅照雯.html */

const brickCols=7, brickRows=5, 
      brickWidth=70, brickHeight=20, 
      brickPadding=10,
      brickPositionTop=15, brickPositionLeft=25,
      paddleWidth=80, paddleHeight=16, paddleRadius=8,
      planeWidth=600, planeHeight=600,
      ballRadius=10;
const brickColors=["#F24B0F", "#F29F05", "#F2CB05", "#83A605", "#0C59F2"];
var num=1;//rand(3, 10); 
var Balls=[], Bricks=[], Paddle, score=0, combo=0, bricksLeft=brickCols*brickRows;

window.onload=function(){
    
    /*score*/
    let score_div=document.createElement("div");
    score_div.id="score_div";
    document.body.appendChild(score_div);
    let h2_score=document.createElement("h2");
    h2_score.id="score";
    score_div.appendChild(h2_score);
    let score_text=document.createTextNode("Score: "+score);
    h2_score.appendChild(score_text);
    
    /*combo*/
    let combo_div=document.createElement("div");
    combo_div.id="combo_div";
    combo_div.style.display="none"; //don't appear at first
    document.body.appendChild(combo_div);

    let h2_value=document.createElement("h2");
    h2_value.id="comboValue";
    combo_div.appendChild(h2_value);
    let combo_value=document.createTextNode(combo);
    h2_value.appendChild(combo_value);

    let h2_combo=document.createElement("h2");
    h2_combo.id="combo";
    combo_div.appendChild(h2_combo);
    let combo_text=document.createTextNode("combo");
    h2_combo.appendChild(combo_text);

    /*plane*/
    let container=document.createElement("div");
    container.id="container";
    container.style.height=planeHeight+"px";
    container.style.width=planeWidth+"px";
    document.body.appendChild(container);

    /*create paddle*/
    Paddle=new paddle();
    Paddle.node.style.left=Paddle.coor.x+"px";
    Paddle.node.style.top=Paddle.coor.y+"px";
    container.appendChild(Paddle.node);

    /*create bricks*/
    for(let i=0;i<brickCols*brickRows; i++){
        Bricks[i]=new brick();
        Bricks[i].coor.x=(i%brickCols)*(brickWidth+brickPadding)+brickPositionLeft;
        Bricks[i].coor.y=Math.floor(i/brickCols)*(brickHeight+brickPadding)+brickPositionTop;
        Bricks[i].node.id=i;//for removing
        Bricks[i].node.style.left=Bricks[i].coor.x+"px";
        Bricks[i].node.style.top=Bricks[i].coor.y+"px";
        container.appendChild(Bricks[i].node);
    }

    /*create ball*/
    for(let i=0; i<num; i++){
        Balls.push(new ball());
        Balls[i].coor.x=Paddle.coor.x+1/2*Paddle.width;
        Balls[i].coor.y=Paddle.coor.y;
    	container.appendChild(Balls[i].node); 
    }

    /*revised random function*/
    function rand(lower, upper){
    	return Math.floor(Math.random()*(upper-lower+1)+lower);
    }
   
    function brick(){
        this.coor={x:0, y:0}; 
        this.state=rand(1, 5);
        this.width=brickWidth;
        this.height=brickHeight;
    	this.node=document.createElement("div"); 
    	this.node.className="brick";
        this.node.style.width=(this.width-2)+"px";
        this.node.style.height=(this.height-2)+"px";
    	this.node.style.backgroundColor=brickColors[this.state-1];
    } 

    function paddle(){
        this.coor={x:Math.floor((planeWidth-paddleWidth)/2), y:planeHeight-paddleHeight-10}; 
        this.width=paddleWidth;
    	this.height=paddleHeight;
        this.radius=paddleRadius;
        this.offset=0;
    	this.node=document.createElement("div"); 
    	this.node.className="paddle";
        this.node.style.width=(this.width-2)+"px";
        this.node.style.height=(this.height-2)+"px";
        this.node.style.borderRadius=this.radius+"px";
    	this.node.style.backgroundColor= "#F21B1B";
    } 

    function ball(){
        this.coor={x:0, y:0};
    	this.offset={x:rand(2, 5), y:rand(2, 5)}; 
    	this.radius=ballRadius;
    	this.node=document.createElement("div"); 
    	this.node.className="ball";
    	this.node.style.backgroundColor="#F2A922";
        this.node.style.borderRadius=this.radius+"px";
    	this.node.style.width=2*(this.radius-2)+"px"; //border=2
    	this.node.style.height=2*(this.radius-2)+"px";
    } 

    /*paddle movement*/
    document.addEventListener("keydown", function(e){
        e=e||window.event;
        if(e.key=="ArrowLeft"){
            Paddle.offset= -Math.floor(paddleWidth/3);
        }else if(e.key=="ArrowRight"){
            Paddle.offset= Math.floor(paddleWidth/3);
        }else{
            Paddle.offset= 0;
        }
        Paddle.coor.x=Math.max(0, Math.min(Paddle.coor.x+Paddle.offset, planeWidth-paddleWidth));
        Paddle.node.style.left=Paddle.coor.x+"px";
    });

    /*check constraints*/
    let timer=setInterval(function(){

        if(combo<=1){
            combo_div.style.display="none";
        }

    	for(let i=0;i<num;i++){//balls
            Balls[i].coor.x+=Balls[i].offset.x;
            Balls[i].coor.y+=Balls[i].offset.y;

            /*check plane boundary*/
            let max=planeWidth-2*Balls[i].radius;
            //game over
            if(Balls[i].coor.y>max){ 
                Paddle.node.style.display="none";
                for(let k=0;k<num; k++) Balls[k].node.style.display="none";
                for(let k=0;k<brickCols*brickRows; k++) Bricks[k].node.style.display="none"; 
                clearInterval(timer);

                let gameover_div=document.createElement("div");
                gameover_div.id="gameover_div";
                container.appendChild(gameover_div);
                let h2_game=document.createElement("h2");
                h2_game.id="gameover";
                gameover_div.appendChild(h2_game);
                let gameOver=document.createTextNode("Game Over");
                h2_game.appendChild(gameOver);

            //other boudaries
            }else if(Balls[i].coor.x>max || Balls[i].coor.x<0 || Balls[i].coor.y<0){
                if(Balls[i].coor.x>max){
                    Balls[i].offset.x*=(-1);
                    Balls[i].coor.x=max;
                }else if(Balls[i].coor.x<0){
                    Balls[i].offset.x*=(-1);
                    Balls[i].coor.x=0;
                }
                if(Balls[i].coor.y<0){
                    Balls[i].offset.y*=(-1);
                    Balls[i].coor.y=0;
                }
            }else{

            /*check bricks*/
                let collision=false;
                for(let j=0;j<brickCols*brickRows && !collision; j++){
                    if(Bricks[j].state!=0){ //brick exist

                        if(Balls[i].coor.x>Bricks[j].coor.x-2*Balls[i].radius &&
                          Balls[i].coor.x<Bricks[j].coor.x+Bricks[j].width  &&
                          Balls[i].coor.y>Bricks[j].coor.y-2*Balls[i].radius &&
                          Balls[i].coor.y<Bricks[j].coor.y+Bricks[j].height){
                            //ball from top & bottom
                            if(Balls[i].coor.x>Bricks[j].coor.x-Balls[i].radius &&
                               Balls[i].coor.x<Bricks[j].coor.x+Bricks[j].width-Balls[i].radius){
                               collision=true;
                               Balls[i].offset.y*=(-1);//bounce
                                if(Balls[i].coor.y>Bricks[j].coor.y+1/2*Bricks[j].height){ //ball from bottom
                                  Balls[i].coor.y=Bricks[j].coor.y+Bricks[j].height;
                                }else{ //ball from top
                                  Balls[i].coor.y=Bricks[j].coor.y-2*Balls[i].radius; 
                                }
                            }
                            //ball from right &  left
                            if(Balls[i].coor.y>Bricks[j].coor.y-Balls[i].radius &&
                               Balls[i].coor.y<Bricks[j].coor.y+Bricks[j].height-Balls[i].radius){
                               collision=true;
                               Balls[i].offset.x*=(-1);//bounce
                                if(Balls[i].coor.x>Bricks[j].coor.x+1/2*Bricks[j].width){  //ball from right
                                  Balls[i].coor.x=Bricks[j].coor.x+Bricks[j].width;
                                }else{ //ball from left
                                  Balls[i].coor.x=Bricks[j].coor.x-2*Balls[i].radius;
                                }
                            }

                            if(collision){
                                Bricks[j].state--;
                                if(Bricks[j].state==0){
                                    bricksLeft--;
                                    Bricks[j].node.style.display="none"; //disappear
                                    /*complete!*/
                                    if(bricksLeft==0){ 
                                        Paddle.node.style.display="none";
                                        for(let k=0;k<num; k++) Balls[k].node.style.display="none";
                                        clearInterval(timer);

                                        let complete_div=document.createElement("div");
                                        complete_div.id="complete_div";
                                        container.appendChild(complete_div);
                                        let h2_complete=document.createElement("h2");
                                        h2_complete.id="complete";
                                        complete_div.appendChild(h2_complete);
                                        let complete_text=document.createTextNode("COMPLETE!");
                                        h2_complete.appendChild(complete_text); 
                                    }
                                }else{
                                     Bricks[j].node.style.backgroundColor=brickColors[Bricks[j].state-1]; //change color
                                }

                                combo++;
                                if(combo>1){ //display combo
                                    combo_div.style.display="block"; 
                                    combo_value.nodeValue=combo;
                                }
                                score+=combo;
                                score_text.nodeValue="Score: "+score;
                            }
                        }
                    }
                }

            /*check paddle*/
                if(!collision){
                    //paddle top
                    if(Balls[i].coor.x>Paddle.coor.x+Paddle.radius-Balls[i].radius && 
                       Balls[i].coor.x<Paddle.coor.x+Paddle.width-Paddle.radius-Balls[i].radius && 
                       Balls[i].coor.y>Paddle.coor.y-2*Balls[i].radius){
                        Balls[i].coor.y=Paddle.coor.y-2*Balls[i].radius;
                        combo=0;
                        if(Balls[i].offset.x*Paddle.offset<0){ //paddle moving and direction opposite to ball
                            Balls[i].offset.y=(-1)*rand(Balls[i].offset.y, 5); //larger y smaller x
                            if(Balls[i].offset.x>0){
                                Balls[i].offset.x=rand(2, Balls[i].offset.x);  
                            }else{
                                Balls[i].offset.x=(-1)*rand(2, -Balls[i].offset.x); 
                            }
                        }else if(Balls[i].offset.x*Paddle.offset>0){ //paddle moving and direction same as ball
                            Balls[i].offset.y=(-1)*rand(2, Balls[i].offset.y); //smaller y larger x
                            if(Balls[i].offset.x>0){
                                Balls[i].offset.x=rand(Balls[i].offset.x, 5);  
                            }else{
                                Balls[i].offset.x=(-1)*rand(-Balls[i].offset.x, 5); 
                            }
                        }else{ //paddle not moving
                            Balls[i].offset.y*=(-1);
                        }
                    }else{
                    //paddle left right   
                        let ballCenter_x=Balls[i].coor.x+Balls[i].radius, ballCenter_y=Balls[i].coor.y+Balls[i].radius,
                            ballOffset_len= Math.sqrt(Balls[i].offset.x**2+Balls[i].offset.y**2),
                            paddleLeftcenter_x=Paddle.coor.x+Paddle.radius, paddleRightcenter_x=Paddle.coor.x+Paddle.width-Paddle.radius, 
                            paddleCenter_y=Paddle.coor.y+1/2*Paddle.height, 
                        //normal
                        leftVector_x=ballCenter_x-paddleLeftcenter_x, leftVector_y=ballCenter_y-paddleCenter_y, leftVector_len=Math.sqrt(leftVector_x**2+leftVector_y**2), 
                        rightVector_x=ballCenter_x-paddleRightcenter_x, rightVector_y=ballCenter_y-paddleCenter_y, rightVector_len=Math.sqrt(rightVector_x**2+rightVector_y**2), 
                        //reflect vector
                        reflectVector_x, reflectVector_y, reflectVector_len;
                        
                        if( leftVector_len<Balls[i].radius && leftVector_y<0){//paddle left top
                            combo=0;
                            reflectVector_x=leftVector_x+Balls[i].offset.x;
                            reflectVector_y=leftVector_y+Balls[i].offset.y;
                            reflectVector_len=Math.sqrt(reflectVector_x**2+reflectVector_y**2);
                            Balls[i].coor.x-=1/2*Balls[i].offset.x;
                            Balls[i].coor.y-=1/2*Balls[i].offset.y;
                            Balls[i].offset.x=reflectVector_x*(ballOffset_len/reflectVector_len);
                            Balls[i].offset.y=reflectVector_y*(ballOffset_len/reflectVector_len);
                        }else if( rightVector_len<Balls[i].radius && rightVector_y<0){ //paddle right top
                            combo=0;
                            reflectVector_x=rightVector_x+Balls[i].offset.x;
                            reflectVector_y=rightVector_y+Balls[i].offset.y;
                            reflectVector_len=Math.sqrt(reflectVector_x**2+reflectVector_y**2);
                            Balls[i].coor.x-=1/2*Balls[i].offset.x;
                            Balls[i].coor.y-=1/2*Balls[i].offset.y;
                            Balls[i].offset.x=reflectVector_x*(ballOffset_len/reflectVector_len);
                            Balls[i].offset.y=reflectVector_y*(ballOffset_len/reflectVector_len);
                        }
                    }  
                }
            }

        Balls[i].node.style.left=Balls[i].coor.x+"px";
        Balls[i].node.style.top=Balls[i].coor.y+"px";
    	}

    }, 25);

}