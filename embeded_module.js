const fs = require('fs');
// const data = fs.readFileSync("./test.txt", "utf8");
// console.log(data);


// fs.readFile('./test.txt', "utf8", (err, data) => {
//     if(err){
//         console.error(err);
//         return;
//     }
//     console.log(data);
// });


// fs.readdir("./", (err, files) => {
//     if(err){
//         console.error(err);
//         return;
//     }
//     console.log(files);
// });

// const files = fs.readdirSync("../");
// console.log(files);

// fs.writeFile("./new-text.txt","example text 0000", function(err){

//     if(err){
//         console.error(err);
//     }
// });

//fs.writeFileSync("./new-text.txt", "example t22ext 0000");

// fs.mkdir("some-dir", function(err) {
//     if(err) console.error(err);
//     else console.log("mkdr Success");
// });

// fs.rmdir("some-dir", function(err){
//     if(err) console.error(err)
//     else console.log("rmdir Success");
// });

// fs.unlink("./new-text.txt", function(err){
//     if(err) console.error(err);
//     else console.log("unlink success");
// });

// fs.stat("./test_fs.js", function(err, stat) {
//     if(err) console.error(err);
//     else {
        
//         if(stat.isDirectory()){
//             console.log("directory is true");
//         }
//         if(stat.isFile()){
//             console.log("file is true");
//         }
//     }
// });

const path = require('path');
console.log(path.join("a","b","c","d"));
console.log(path.join("a","/b","/c","d"));
console.log(path.join("a","b","c","../","d"));
console.log(__dirname);

console.log(process.cwd());
console.log(path.resolve("fs"));
console.log(path.resolve("a","b","c","../","d"));
console.log(path.resolve("a","b","/c"));
console.log(path.resolve("a","/b","/c","d"));
console.log(path.resolve("a","b","c"));
console.log(path.resolve("/"));