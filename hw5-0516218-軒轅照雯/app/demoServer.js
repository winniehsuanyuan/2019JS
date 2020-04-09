var http=require('http');
var fs=require('fs');
var url=require('url');
var qs=require('querystring');
var formidable = require('formidable'); 

module.exports.init= function(port=80){
   http.createServer(function(request, response){
     var pathname=url.parse(request.url).pathname;
	 //pathname: /songInsert, /songDelete, /index
	 switch(pathname){
		case "/songInsert": songInsert(request, response);
		    break;
		case "/songDelete": songDelete(request, response);
		    break;
		case "/":
		case "/index":
		case "/demo.html":
		case "/index.html":
		case "/default.html": index(request, response);
		    break;
		//case "/demo.js": case "/demo.css": case"/favicon.ico":
		default:
		    fs.createReadStream('../public'+pathname)   //上一層下面的  ./一樣的目錄
			.on('error', function(e){
			   console.log('Error:%s', e);
			   if(e.code=='ENOENT'){
				   response.writeHead(200,{'Content-type':'text/html'});
				   response.write(pathname+'File not found!');
				   response.end();
			   }else{ 
			       throw e;
			   }
			})
			.pipe(response);
	 } 
   }).listen(port, '0.0.0.0', function(){
	   
   });
   
   
}

function songInsert(request, response){
	var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
	    var oldpath = files.songFile.path;
        var newpath = '../public/' + files.songFile.name;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          fs.appendFileSync("list.txt", fields.songName+","+files.songFile.name+"\n");
		  index(request, response);
      });
    });
}

function songDelete(request, response){
	var no=qs.parse(url.parse(request.url).query).no;
	var content=fs.readFileSync("list.txt", 'utf-8');
	var lines=content.split('\n');
	fd=fs.openSync("list.txt", 'w');
	 lines.forEach(function(line, lineNo){
		console.log(line);
		if(line.length>0){
			if(lineNo==no){
			   let song=line.split(',');
			   fs.unlink("../public/"+song[1], function(err){
			   if(err) throw err; //if do err, delete succesfully
			   console.log(song[1]+'deleted!');
			   });
		    }else{
			   fs.writeSync(fd, line+"\n");
		    }
		}
		//console.log(content);
	});	
	fs.closeSync(fd);
	index(request, response);
}

function index(request, response){
    var content=fs.readFileSync("list.txt", "utf-8");
	var lines=content.split('\n');
    content=' ';
    lines.forEach(function(line, lineNo){
		console.log(line);
		if(line.length>0){
			let song=line.split(',');
			content+='<tr>'
			       +'<td>'+ lineNo + '</td>'
				   +'<td>'+ song[0] + '</td>'
				   +'<td>'+ song[1] + '</td>'
				   +'<td>'
				   +'<input name="btnPlay" type="button" value="play" mp3file="'+ song[1] + '">'
				   +'<input name="btnDel" type="button" value="delete" mp3no="'+ lineNo + '">'
				   +'</td>'
				   +'</tr>';
		}
		//console.log(content);
	});	
	var html=fs.readFileSync("demo.html","utf-8");
    response.writeHead(200,{'Content-type':'text/html'});
	response.write(html.replace("{{content}}", content));
	response.end();
}
		
		
		
		
		
		
		
		
		
		
		
		