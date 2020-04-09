// purpose: hw2-0516218-軒轅照雯.html
"use strict"; //force you to use strict 
var i, j, ans;//declaration

document.write('<div>');
document.write('<h1>Magic Game</h1>');
document.write('<p>Pick a number between 1~63, keep in your mind and tell me which cards contain your number.</p>');
document.write('<p><input id="b" type="button" value="SHOW THE ANSWER"></p>');  
document.write('</div>');
//document.write('<xmp>'); //debuging

let ans_div=document.createElement("div");
document.body.appendChild(ans_div);
let ans_h2=document.createElement("h2");
ans_div.appendChild(ans_h2);
let answer=document.createTextNode("The number in your mind is ...");
ans_h2.appendChild(answer);

document.write('<div id="table_container">');
for(i=0;i<6;i++){
   document.write('<table>');
   document.write('<tr><td colspan="8" class="card_title">'+(i+1))  //+:connect strings

   if((i+1)==1)  document.write('st');      //1st
   else if((i+1)==2)  document.write('nd'); //2nd
   else if((i+1)==3)  document.write('rd'); //3rd
   else document.write('th');               //4th 5th 6th
   document.write(' card'+'<input class="cb" type="checkbox">'+'</td></tr>');

   for(j=0;j<32;j++){
	     if(j%8==0) document.write('<tr>');
	     document.write('<td>'+(j*2-(j%(2**i))+(2**i))+'</td>');  //**power 2**i=2^i
		  if(j%8==7) document.write('</tr>');
   }
   document.write('</table>');
}
document.write('</div>');
//document.write('</xmp>'); //debuging

b.addEventListener("click", function(e){
   ans=0;
   let box=document.getElementsByClassName("cb");
   for(i=0;i<6;i++){
      if(box[i].checked){
          ans+=Math.pow(2, i);
      }
   }
   answer.nodeValue=+ans+" !";
});

