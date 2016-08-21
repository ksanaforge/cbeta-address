var Sax=require("sax");
var fs=require("fs");
var path=require("path");
var sourcepath="../../CBReader/XML/";
var lst=fs.readFileSync("lst/t.lst","utf8").split(/\r?\n/);
lst.length=2;
//T01+T02=390 
var codec=require("./codec");
var serialize=require("./serialize");
var tagstack=[],linetext="";
var fnnow="", prevline=0;
var maxpg=0,stopfile=false;

var addLine=function(){
	serialize.addLine(linetext,prevline);
	linetext="";
}
var handlers={
	lb:function(node){
		if (prevline && !stopfile) addLine();
		prevline=codec.pack(fnnow.substr(1,2)+"p"+node.attributes.n+"00");
	}
	,p:function(node){
		if (stopfile)return;
		serialize.addParagraph(linetext);
	}
	,milestone:function(node) {
		if (node.attributes.unit && node.attributes.unit=="juan"){
			var juanname=sid+"."+node.attributes.n;
			serialize.addJuan(juanname,prevline);
		}
	}
	,back:function(){
		addLine();
		stopfile=true;
	}
}
var onopentag=function(node){
	tagstack.push([node.name,node.attributes]);
	var handler=handlers[node.name];
	handler&&handler(node);
}
var onclosetag=function(tagname){
	var t=tagstack.pop();
}
var ontext=function(t){
	if (stopfile || !prevline)return;
	linetext+=t;
}
var lastvol="";

var setSid=function(fn){
	var i=fn.indexOf('/');
	sid=fn.substr(i+5,5);
	if (sid[4]=="_") sid=sid.substr(0,4);
	while(sid[0]=="0") sid=sid.substr(1);
	return sid;
}

var processFile=function(fn){
	setSid(fn);

	var content=fs.readFileSync(sourcepath+fn,"utf8");
	//console.log(fn,content.length);
	prevline=0,linetext="",stopfile=false;
	fnnow=fn;
	var parser=Sax.parser(true);
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;	
	parser.write(content);

	var fn=fn.substr(0,fn.length-3)+"js";
	serialize.write(fn);
}

lst.forEach(processFile);

serialize.finalWrite();