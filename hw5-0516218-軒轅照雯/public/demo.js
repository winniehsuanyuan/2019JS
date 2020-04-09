window.addEventListener("load", function(){

	document.getElementsByName("btnPlay").forEach(function(item){
		item.addEventListener("click", function(){
			var au=document.getElementById("mp3player");
			au.src=this.getAttribute("mp3file");
			au.play();
		});
	});

	document.getElementsByName("btnDel").forEach(function(item){
		item.addEventListener("click", function(){
			location.href="/songDelete?no="+this.getAttribute("mp3no");
		});
	});

});