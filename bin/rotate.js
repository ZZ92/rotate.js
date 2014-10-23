#!/usr/bin/env node
require('shelljs/global');
var path = require('path') 

var fs = require('fs');
var BufferHelper = require('bufferhelper');
var Handlebars = require('handlebars');



if (!which('phantomjs')) {
  echo('Sorry, this script requires phantomjs,please do [sudo]npm install -g phantomjs');
  exit(1);
}

// var result_html_dir = process.cwd() + '/result.html';
var result_html_dir ='/var/tmp/result.html';
rm('-rf', result_html_dir);

var program = require('commander');

function range(val) {
    return val.split('..').map(Number);
}

function list(val) {
    return val.split(',');
}

program
    .version('0.0.1')
    .usage(" -s 'input.png' -t 'out.png' -d 1")
    .option('-s, --src [value]', '原图片名称')
    .option('-t, --dest [value]', '生成后的图片名称')
    .option('-d, --degree [value]', '旋转角度，0代表正常，1代表旋转90度，2代表180度，3代表270度', parseInt)
    .option('-v, --verbose', '打印详细日志')
// program
//     .command('deploy ')
//     .description('rotate image')
//     .action(function(name){
//         console.log('Deploying "%s"', name);
//     });

var src = "input.png";
var dest = "out.png";
var degree = 1;
var verbose = false;



program.parse(process.argv);

// console.log(program);
if(program.src){
	src = program.src;


	src = path.normalize(src);
	// -s '/var/tmp/test.png' 
	// -s 'test.png' 
	// -s 'img/test.png' 
	// -s './test.png' 
	// -s './img/test.png' 
	// if(src.split('./').length == 0){
	//
	// }
	
	src = path.resolve(process.cwd(),src)

	
	
}


console.log('src = ' + src);
if(program.dest){
	dest = program.dest;
}

if(program.degree){
	degree = program.degree;
}

if(program.verbose){
	verbose = program.verbose;
}


function log(str){
	if(verbose == true){
		console.log(str);
	}
}

// phantomjs simple.js test.jpg

log(' src  - %s ',src);
log(' dest - %s ', dest);
log( degree);
 
 

var lib_dir = __dirname.split('/')
lib_dir.pop();
lib_dir.push('lib');

log(__dirname);
// lib_dir = lib_dir.join('/');


// var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
//              "{{kids.length}} kids:</p>" +
//              "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
// var template = Handlebars.compile(source);
//
// var data = { "name": "Alan", "hometown": "Somewhere, TX",
//              "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
// var result = template(data);
//
 
log('Starting directory: ' + process.cwd());
 

var rs = fs.createReadStream(lib_dir.join('/') +'/tmpl.html', {encoding: 'utf-8', bufferSize: 11}); 
var bufferHelper = new BufferHelper();


rs.on("data", function (trunk){
		bufferHelper.concat(trunk);
});

rs.on("end", function () {
	var source = bufferHelper.toBuffer().toString();
	var template = Handlebars.compile(source);
	
	// console.log(source);
	var data1 = {
		"src": src
	};

	var contents = new Buffer( template(data1) );
	
	//console.log(template(data1));
	
  fs.writeFile(result_html_dir ,contents ,function(err){
         if(err) throw err;
         
				 log('template html has finished'); 
				 
				 degree = 0
				 // Run external tool synchronously
				 if (exec('phantomjs '+lib_dir.join('/')+'/rotate_for_phantom.js ' + src + ' '  + dest + ' '+ degree + ' ' + result_html_dir + ' ' + verbose).code !== 0) {
				   echo('Error: rotate it failed');
				   exit(1);
				 }
				 echo('Success rotate it'); // '/usr'
				 // rm('-rf', result_html_dir);
     });
	
});
