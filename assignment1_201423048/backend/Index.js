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
            fs.readdir(cur_path, { withFileTypes: true }, function (err, data) {
                dirInfo = "";
                console.dir(data);

                data.forEach(function (element) {

                    console.log(element);

                    var stats = fs.statSync(path.join(cur_path, element.name));
                    modi_date = stats.mtime;
                    fileSize = stats.size;

                    if (element.isDirectory()) {
                        dirInfo += "<tr class='d'><td onclick='changeDir(this);'>" + element.name + "</td>" +
                            "<td onclick='removeDir(this);'>delete</td>" +
                            "<td onclick='rename(this);'>rename</td>" +
                            "<td></td>" +
                            "<td>-</td>" + "<td>" + modi_date + "</td></tr>";
                    }
                    else if (element.isFile()) {
                        dirInfo += "<tr class='f'><td onclick='readFile(this);'>" + element.name + "</td>" +
                            "<td onclick='removeFile(this);'>delete</td>" +
                            "<td onclick='rename(this);'>rename</td>" +
                            "<td onclick='updateFile(this);'>edit</td>" +
                            "<td>" + fileSize + "B" + "</td>" + "<td>" + modi_date + "</td></tr>";
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

        console.log('/editfile pathname');

        var body = '';
        var fileContent;

        request.on('data', function (data) {
            console.dir("1. data : " + data);
            body = body + data;
            console.dir("2. body : " + body);
        });

        request.on('end', function () {
            var post = qs.parse(body);
            console.dir(post);
            file_name = post.file_name;
            console.log("4.file_name: " + file_name);
            var file_path = path.join(cur_path, file_name);
            console.log("5.file_path:" + file_path);
            fileContent = fs.readFileSync(file_path, 'utf-8');
            console.dir(fileContent);


            response.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
            response.write('<p>파일편집화면</p>');
            response.write('<form method="POST" action="http://localhost:3000/writefile">');
            response.write('<p>파일이름</p>');
            response.write('<input type="text" name="title" value = ' + file_name + ' >');
            response.write('<p>파일내용</p>');
            response.write('<textarea name="description" type="text" cols="50" rows="20">' + fileContent + '</textarea>');
            response.write('<input type="submit" value="edit file">');
            response.end();
        });

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
    else if (pathname === '/writefileFormat') {

        fs.readFile('../frontend/createFile.html', function(err, tmp1){
            let html = tmp1.toString();
            response.writeHead(200, {'Content-Type':'text/html'});
            response.end(html);
        });
    }
    else if(pathname === '/writefile'){
        console.log('writefile call');
        var body = '';
        var dir_name;
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            console.dir(post);
            var title = post.title;
            var description = post.description;
            var file_path = path.join(cur_path, title);
            fs.writeFile(file_path, description, function(err, data){
                file_content = description;
                response.writeHead(302, {Location : '/'});
                response.end('success');
            });
        });
    }
    else if (pathname === '/mkdirFormat'){
        fs.readFile('../frontend/createDir.html', function(err, tmp2){
            let html = tmp2.toString();
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(html);
        });
    }
    else if (pathname === '/mkdir') {
        console.log('mkdir call');

        var body = '';
        var dir_name;

        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            console.dir(post);
            dir_name = post.direcName;
            console.log(dir_name);
            var dir1 = path.join(cur_path, dir_name);
            console.log(dir1);
            fs.mkdir(dir1, function (err) {
                if(err) console.error(err);
                else console.log('mkdir success');

                response.writeHead(302, { Location: '/' }); // 'http://localhost:3000/'
                response.end('success');
            });
        });
    }
    else if (pathname === '/rmdir') {

    }
    else if (pathname === '/rmFile') {

    }
    else if (pathname === '/rename') {

    }

});

app.listen(3000);