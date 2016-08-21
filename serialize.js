/* save and load taisho line text effectively */
var codec=require("./codec");
var fs=require("fs");
var juanstart=[];//taisho pointer
var juanname=[];//sutta#juan
var linebreaks=[],paragraphs=[];
var outputline="",output=[];
var outpath="ins/"
var outpath="../taishonote/data/";
var outmode="jsonp";
var previous=0;

var addParagraph=function(text){
	paragraphs.push(outputline.length+text.length);
}
var addLine=function(text,pointer){
	var r=codec.decompose(pointer);
	var dis=codec.lineDistance(previous,pointer)-1;
	while (dis>0) {
		//console.log(dis,codec.unpack(pointer),codec.unpack(previous))
		linebreaks.push(outputline.length);
		dis--;
	}

	//removing leading and ending crlf
	while (text.charCodeAt(0)<0x20) text=text.substr(1);
	while (text.charCodeAt(text.length-1)<0x20) text=text.substr(0,text.length-1);
	outputline+=text;
	linebreaks.push(outputline.length);
	previous=pointer;
}
var addJuan=function(name,pointer){
	linebreaks=[];
	outputline="";
	juanname.push(name);
	juanstart.push(pointer);
	previous=pointer;
}
var toString=function(out){
	return JSON.stringify(out,""," ");
}
var compress=function(arr){
	var now=arr[0];
	for (var i=1;i<arr.length;i++) {
		delta=arr[i]-now;
		now=arr[i];
		arr[i]=delta;
	}
	return arr;
}	
var deltaArrToString=function(arr){
	return JSON.stringify(compress(arr));
}

var write=function(fn){
	var dir=fn.split('/');
	dir.pop();
	dir=dir.join('/');
	if (!fs.existsSync(outpath+dir)){
		fs.mkdirSync(outpath+dir);
	};

	console.log("writing to "+fn);
	var out=(outmode=="jsonp")?'loadscriptcb({"content":\n':'module.exports={"content":\n';
	out+=toString(outputline);
	out+=',\n"lb":'+deltaArrToString(linebreaks);
	out+=',\n"p":'+deltaArrToString(paragraphs);
	out+=(outmode=="jsonp")?"\n})":"\n}";
	fs.writeFileSync(outpath+fn,out,"utf8");
	outputline="";
	output=[];
	linebreaks=[];
	paragraphs=[];
}
var finalWrite=function(){
	var out="module.exports={";
	out+='"juanname":'+JSON.stringify(juanname);
	out+='\n,"juanstart":'+JSON.stringify(juanstart);
	out+="\n}"
	fs.writeFileSync(outpath+"juan.js",out,"utf8");
}
module.exports={addJuan,addLine,addParagraph,write,finalWrite};