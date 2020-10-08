tvar http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var cur_path = path.resolve('../fs');

var file_name = "";
var file_content = "";

var app = http.createServer(function(request, response){

    var _url = request.url;
    var querystring = url.parse(_url, true);
    var pathname = url.parse(_url, true).pathname;
    
    if(pathname === '/')
    {
        fs.readFile("../frontend/template2.html", function(err, tmp1){
            fs.readdir(cur_path, function(err, data){
                lsinfo = "";
                data.forEach(function(element){
                    lsinfo += "<li onclick='readfile(this);'>" + element + "</li>";
                });
                let html = tmp1.toString().replace('%', lsinfo);
                html = html.replace('?', file_name);
                html = html.replace('$', file_content);
                response.writeHead(200, {'Content-Type':'text/html'});
                response.end(html);
            });
        });
    }
    else if(pathname === '/readfile')
    {
        var body = '';
        request.on('data', function(data){
            console.dir(data);
            body = body + data;
            console.dir(body);
        });
        request.on('end', function(){
            var post = qs.parse(body);
            console.dir(post);

            file_name = post.file_name;
            console.log(file_name);
            var file_path = path.join(cur_path, file_name);
            fs.readFile(file_path, 'utf8', function(err, data){
                console.log(file_path);
                file_content = data;
                response.writeHead(302, {Location: '/'}); // 'http://localhost:3000/'
                response.end('success');
            });
        });
    }
    else if(pathname === '/writefile')
    {
        var body = "";
        request.on('data', function(data){
            body = body + data;
        });

        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            var file_path = path.join(cur_path, title);
            fs.writeFile(file_path, description, function(err, data){
                response.writeHead(302, {Location: 'http://localhost:3000/'});
                response.end('success');
                //response.redirect("/");
            });
        });
    }

});

app.listen(3000);