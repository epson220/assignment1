var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var cur_path = path.resolve('../fs');

var file_name = "";
var file_content = "";
var fileSize;
var modi_date;

var app = http.createServer(function (request, response) {

    var _url = request.url;
    var querystring = url.parse(_url, true);
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        fs.readFile("../frontend/Template.html", function (err, tmp1) {
            fs.readdir(cur_path, {withFileTypes:true}, function (err, data) {
                dirInfo = "";
                console.dir(data);

                data.forEach(function (element) {

                    console.log(element);

                    var stats = fs.statSync(path.join(cur_path, element.name));
                    modi_date = stats.mtime;

                    if (element.isDirectory()) {
                        dirInfo += "<tr class='d'><td onclick='changeDir(this);'>" + element.name + "</td>" +
                            "<td onclick='removeDir(this);'>delete</td>" +
                            "<td onclick='rename(this);'>rename</td>" +
                            "<td>" + fileSize + "</td>" + "<td>" + modi_date + "</td></tr>";
                    }
                    else if (element.isFile()) {
                        dirInfo += "<tr class='f'><td onclick='readFile(this);'>" + element.name + "</td>" +
                            "<td onclick='removeFile(this);'>delete</td>" +
                            "<td onclick='rename(this);'>rename</td>" +
                            "<td>" + fileSize + "</td>" + "<td>" + modi_date + "</td></tr>";
                    }


                });
                let html = tmp1.toString().replace('&', dirInfo);
                html = html.replace('?', file_name);
                html = html.replace('$', file_content);
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(html);
            });
        });
    }
    else if (pathname === '/editfile') {

    }
    else if (pathname === '/cd') {
        var body = '';
        request.on('data', function (data) {
            console.dir(data);
            body = body + data;
            console.dir(body);
        });

        request.on('end', function () {
            var post = qs.parse(body);
            console.dir(post);
            cur_path = path.join(cur_path, post.path_name);
            response.writeHead(302, { Location: '/' });
            response.end('cd success');
        });

    }
    else if (pathname === '/readfile') {
        var body = '';
        request.on('data', function (data) {
            console.dir(data);
            body = body + data;
            console.dir(body);
        });
        request.on('end', function () {
            var post = qs.parse(body);
            console.dir(post);

            file_name = post.file_name;
            console.log(file_name);
            var file_path = path.join(cur_path, file_name);
            fs.readFile(file_path, 'utf8', function (err, data) {
                console.log(file_path);
                file_content = data;
                response.writeHead(302, { Location: '/' }); // 'http://localhost:3000/'
                response.end('success');
            });
        });
    }
    else if (pathname === '/mkdir') {

    }
    else if (pathname === '/rmdir') {

    }
    else if (pathname === '/rmFile') {

    }
    else if (pathname === '/rename') {

    }

});

app.listen(3000);