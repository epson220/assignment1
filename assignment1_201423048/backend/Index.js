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

var deleteDirRecursive = function(loc){

    console.log('deleteDirRecursive called');

    fs.readdirSync(loc).forEach(function(element){
        if(fs.lstatSync(path.join(loc, element)).isDirectory()){
            deleteDirRecursive(path.join(loc, element));
        }
        else if(fs.lstatSync(path.join(loc, element)).isFile()){
            fs.unlinkSync(path.join(loc, element));

        }
    });

    // fs.readdirSync(loc, { withFileTypes: true } ,function(err, data){
    //     if(err){
    //         console.error(err);
    //     }
    //     data.forEach(function(element){
    //         if(element.isDirectory()){
    //             deleteDirRecursive(path.join(loc, element.name));
    //         }
    //         else if(element.isFile()){
    //             fs.unlinkSync(path.join(loc, element.name));
    //         }
    //     });
    // });

    fs.rmdirSync(loc);
}

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
                            "<td>-</td>" +
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
            response.write('<h4>' + file_name + '</h4>');
            response.write('<input type="hidden" name="title" value = ' + file_name + ' >');
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
                response.end('readfile success');
            });
        });
    }
    else if (pathname === '/writefileFormat') {

        fs.readFile('../frontend/createFile.html', function (err, tmp1) {
            let html = tmp1.toString();
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(html);
        });
    }
    else if (pathname === '/writefile') {
        console.log('writefile call');
        var body = '';
        var dir_name;
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            console.dir(post);
            var title = post.title;
            var description = post.description;
            var file_path = path.join(cur_path, title);
            fs.writeFile(file_path, description, function (err, data) {
                file_content = description;
                file_name = title;
                response.writeHead(302, { Location: '/' });
                response.end('write file success');
            });
        });
    }
    else if (pathname === '/mkdirFormat') {
        fs.readFile('../frontend/createDir.html', function (err, tmp2) {
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
                if (err) console.error(err);
                else console.log('mkdir success');

                response.writeHead(302, { Location: '/' }); // 'http://localhost:3000/'
                response.end('mkdir success');
            });
        });
    }
    else if (pathname === '/rmdir') {

        console.log('/rmdir pathname call');

        var body = '';
        var dir_name3;

        request.on('data', function(data){
            body = body + data;
        });

        request.on('end', function(){
            var post = qs.parse(body);
            dir_name3 = post.dirName;
            console.log(dir_name3);
            var dir_location = path.join(cur_path, dir_name3);
            console.log(dir_location);

            deleteDirRecursive(dir_location);

            response.writeHead(302, {Location : '/'});
            response.end();
        });

    }
    else if (pathname === '/rmFile') {
        console.log('rmFile pathname');

        var body = '';
        var file_name2;

        request.on('data', function(data){
            body = body + data;
        });

        request.on('end', function(){
            var post = qs.parse(body);
            file_name2 = post.file_name;
            var file_location = path.join(cur_path, file_name2);
            console.log(file_location);
            fs.unlinkSync(file_location);
            file_name = '';
            file_content = '';

            response.writeHead(302, {Location : '/'});
            response.end('rmFIle success');
        });

    }
    else if (pathname === '/renameFormat') {

        var body = ''

        request.on('data', function (data) {
            body = body + data;
        });

        request.on('end', function () {
            var post = qs.parse(body);
            var origin = post.origin;
            
            response.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
            response.write('<form method="POST" action="http://localhost:3000/rename" >');
            response.write('<h4>이름변경</h4>');
            response.write('<input type="text" name="renamed" value=' + origin + ' >');
            response.write('<input type="hidden" name="origin" value=' + origin + ' >');
            response.write('<input type="submit" value="저장" />');
            response.write('</form>');
            response.end();
        });

    }
    else if (pathname === '/rename') {

        console.log('rename backend');

        var body = '';

        request.on('data', function (data) {
            body = body + data;
            console.log(body);
        });

        request.on('end', function () {
            var post = qs.parse(body);
            var renamed = post.renamed;
            var origin = post.origin;

            var file_path = path.join(cur_path, origin);
            var new_file_path = path.join(cur_path, renamed);

            //file_name = renamed;
            fs.renameSync(file_path, new_file_path);
            file_name = '';
            file_content = '';

            response.writeHead(302, { Location: '/' }); // 'http://localhost:3000/'
            response.end('rename success');

        });
    }

});

app.listen(3000);