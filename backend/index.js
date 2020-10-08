var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require('path');
var cur_path = path.resolve('../fs');
var file_name = "";
var file_content = "";

var app = http.createServer(function(request, response){
    
    //localhost:3000/?name=mike
    var _url = request.url; // '/?name=mike'
    var queryData = url.parse(_url, true).query; //{name: 'mike'}
    var pathname = url.parse(_url, true).pathname; // '/'

    // console.log(typeof(_url)); //string
    // console.log(typeof(queryData)); //object
    // console.log(typeof(pathname)); //string

    // console.log("_url : ");
    // console.dir(_url);
    // console.log("queryData : ");
    // console.dir(queryData);
    // console.log("pathname : ");
    // console.dir(pathname);
    
    if(pathname === '/'){

        fs.readFile("../frontend/template.html", function(err, tmp1){ //tmp1 : template.html

            console.dir(tmp1);

            fs.readdir(cur_path, function(err, data){
                
                console.dir(data); //data : 배열 [ 'Cicero.txt', 'Kafka.txt', 'Lorem.txt' ]

                let html = tmp1.toString().replace('%', data.join("</li><li>"));
                html = html.replace("?", file_name);
                html = html.replace("$", file_content);
                response.writeHead(200, {'Content-Type':'text/html'});
                response.end(html);

            });
        });
    }
});

app.listen(3000);