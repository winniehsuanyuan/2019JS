/* purpose: hw3-0516218-軒轅照雯.html */
let container=document.createElement("div");
container.id="container";
document.body.appendChild(container);

/*background decoration*/
let C=[];
for(let i=0;i<6;i++){
	C.push(document.createElement("div"));
    C[i].id="c"+i;
    C[i].className="circle";
	document.body.appendChild(C[i]);
}

/*create balls*/
let num=rand(3, 10); 
let Balls=[];
for(let i=0; i<num; i++){
    Balls.push(new ball());
	container.appendChild(Balls[i].node); 
}


let timer=setInterval(run, 45); /*speed*/
function run(){
  for(let i=0; i<num; i++){
    Balls[i].move();
  }
}

/*revised random function*/
function rand(lower, upper){
	return Math.floor(Math.random()*(upper-lower+1)+lower);
}

/*ball attributes & function*/
const X=0, Y=1; /*index*/
function ball(){
    this.coor=[rand(0, 490), rand(0, 490)]; /*random initial location*/
	this.offset=[rand(2, 5), rand(2, 5)];   /*random initial direction*/
	this.node=document.createElement("div"); 
	this.node.className="ball";
	this.node.style.backgroundColor="rgb(" +rand(200, 255)+ "," + rand(65, 200)+ "," + rand(70, 255)+ ")"; /*random initial pink colors*/
	this.bsize=rand(10, 30);                /*random size*/
    this.node.style.width=this.bsize+"px";
    this.node.style.height=this.bsize+"px";
    this.node.style.borderRadius=(this.bsize/2)+"px";
} 

ball.prototype.move= function(){
    let max=500-this.bsize;
	for(axis in [X, Y]){
		this.coor[axis]+=this.offset[axis];
	 	 if(this.coor[axis]>max || this.coor[axis]<0){ /*exceed borders*/
			this.node.style.backgroundColor="rgb(" +rand(200, 255)+ "," + rand(65, 200)+ "," + rand(70, 255)+ ")"; /*change color*/
			this.offset[axis]=rand(2, 5); /*change direction*/
		    if(this.coor[axis]>max){
			   this.coor[axis]=max;
			   this.offset[axis]*=(-1);  /*max borders: change sign of the direction*/
			}else if(this.coor[axis]<0){
			   this.coor[axis]=0;
			}
		}
	}
    this.node.style.left=this.coor[X]+"px"; /*absolute positions*/
	this.node.style.top=this.coor[Y]+"px";  /*absolute positions*/
}