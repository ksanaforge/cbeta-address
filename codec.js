var pat=/[A-Z]?(\d{2,3})p(\d\d\d\d)([abcd])(\d\d)(\d\d)/
var sides={a:0,b:1,c:2,d:3};
var pack=function(str){
	var r=str.match(pat);
	if (!r) return null;

	var side=sides[r[3]];
	var vol=parseInt(r[1],10), page=parseInt(r[2],10);
	var line=parseInt(r[4],10), ch=parseInt(r[5]);
	var r={ vol,page,side,line,ch};
	return compose( r);
}

var decompose=function(c){
	var ch=c%32;
	var line=Math.floor((c/32)%32);
	var side=Math.floor((c/1024)%4);
	var page=Math.floor((c/4096)%2048);
	var vol=Math.floor((c/8388608)%128);

	var r={vol,page,side,line,ch };
	return r;
}
var compose=function(r) {
	var res=r.vol*8388608 //Vol
	+r.page*4096  //pg
	+r.side*1024               //side
	+r.line*32    //line
	+r.ch;      //ch
	return res;
}
//faster than decompose
var charOf=function(c){
	return c%32;
}
var lineOf=function(c){
	return Math.floor((c/32)%32);
}
var pageOf=function(c){
	return Math.floor((c/4096)%2048);
}
var sideOf=function(c){
	return Math.floor((c/1024)%4);
}
var volOf=function(c){
	Math.floor((c/8388608)%128);
}

var unpack=function(pointer){
	var r=decompose(pointer);
	r.ch="0"+r.ch; r.ch=r.ch.substr(r.ch.length-2);
	r.line="0"+r.line; r.line=r.line.substr(r.line.length-2);
	r.side=["a","b","c","d"][r.side];
	r.page="000"+r.page; r.page=r.page.substr(r.page.length-4);
	r.vol="0"+r.vol; r.vol=r.vol.substr(r.vol.length-2);

	var q=r.vol+"p"+r.page+r.side+r.line+r.ch;
	return q;
}
//cannot cross volumn
var lineDistance=function(p1,p2){
	return (pageOf(p2)*87+sideOf(p2)*29+lineOf(p2) )
	- (pageOf(p1)*87+sideOf(p1)*29+lineOf(p1));
}

var nextLine=function(pointer,advanceline){
	var d=decompose(pointer);
	advanceline=advanceline||1;

	while (advanceline) {//naive...room to improve
		if (d.line==29) {
			if (d.side==2) {
				d.side=0;
				d.page++;
			} else {
				d.side++;
			}
			d.line=1;
		} else {
			d.line++;
		}		
		advanceline--;
	}

	return compose(d);
}
//A range =  delta<<32 + pointer
//delta should not cross a juan , less than 16 bits

module.exports={pack,unpack,compose,decompose,nextLine
,charOf,lineOf,sideOf,pageOf,volOf,lineDistance}