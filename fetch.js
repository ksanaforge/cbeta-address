/* */
var codec=require("./codec");

var isChar=function(code){
	return code>=0x3400&&code<=0x9fff;
}
var isSurrogate=function(code){
	return code>=0xd800&&code<=0xdfff;
}
var charpos=function(l,n){
	var i=0,now=0;
	while (i<l.length && now<n) {
		var c=l.charCodeAt(i);
		if (isChar(c)){
			now++;
		} else if (isSurrogate(c)){
			now++;i++;
		}
		i++;
	}
	while (i<l.length) {//include puncuation mark
		var c=l.charCodeAt(i);
		if (!isChar(c) && !isSurrogate(c)) i++;
		else break;
	}
	return i;
}
//will not cross volumn
var nextline=function(pointer){
	var b=codec.decompose(pointer);
	if (b.line==29) {
		if (b.side==2) {
			b.page++;
			b.side=0;
		} else {
			b.side++;
		}
		b.line=1;
	} else {
		b.line++;
	}
	b.ch=1;
	return codec.compose(b);
}
var getPage=function(d){
	var file=require("./ins/t"+d.vol+".js");
	var lines=file[d.page-1].split("\n");
	return lines;
}
var getline=function(pointer){
	var r=codec.decompose(pointer);
	var lines=getPage(r);
	line= lines[r.side*29+r.line-1];
	return line;
}
var getline_start=function(pointer){
	var r=codec.decompose(pointer);
	var lines=getPage(r);
	line= lines[r.side*29+r.line-1];
	var pos=charpos(line,r.ch-1);
	return line.substr(pos);
}
var getline_end=function(pointer){
	var r=codec.decompose(pointer);
	var lines=getPage(r);
	line= lines[r.side*29+r.line-1];
	var pos=charpos(line,r.ch);
	return line.substr(0,pos);
}

var isSameLine=function(p1,p2){
	var b1=codec.decompose(p1),b2=codec.decompose(p2);
	
	return (b1.vol==b2.vol&&b1.page==b2.page&&b1.side==b2.side&&b1.line==b2.line);
}

var fromto=function(from,to){
	if (isSameLine(from,to)){
		var line=getline(from);
		var r1=codec.decompose(from), r2=codec.decompose(from);
		var p1=charpos(line,r1.ch), p2=charpos(line,r2.ch);
		return line.substring(p1,p2);
	};
	console.log('fromto',from,to)
	var start=getline_start(from);
	var next=nextline(from);
	var o=start+"\n";
	while (next<to) {
		o+=(next+32<to)?getline(next)+"\n":getline_end(to);
		next=nextline(next);
	}
	return o;
}

module.exports={fromto};
