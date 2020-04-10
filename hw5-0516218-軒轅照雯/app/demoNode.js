//URI
//1.http://localhost/songInsert
//2.http://localhost/songDelete
//3.http://localhost/
//http://localhost/index
//http://localhost/demo.html
//http://localhost/index.html

var server=require("./demoServer.js"); //accept http request

server.init();
server.init(8080);
