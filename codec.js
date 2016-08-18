var pat=/[A-Z]?(\d{2,3})p(\d\d\d\d)([abcd])(\d\d)(\d\d)/
var sides={a:0,b:1,c:2,d:3};
var pack=function(str){
	var r=str.match(pat);
	if (!r) return null;
	var side=sides[r[3]];
	return parseInt(r[1],10)*8388608 //Vol
	+parseInt(r[2],10)*4096  //pg
	+side*1024               //side
	+parseInt(r[4],10)*32    //line
	+parseInt(r[5],10);      //ch
}
var unpack=function(c){
	var ch=c%32;
	ch="0"+ch; ch=ch.substr(ch.length-2);
	var line=Math.floor((c/32)%32);
	line="0"+line; line=line.substr(line.length-2);
	var side=["a","b","c","d"][Math.floor((c/1024)%4)];
	var pg=Math.floor((c/4096)%2048);
	pg="000"+pg; pg=pg.substr(pg.length-4);

	var vol=Math.floor((c/8388608)%128);
	vol="0"+vol; vol=vol.substr(vol.length-2);

	var r=vol+"p"+pg+side+line+ch;
	return r;
}
module.exports={pack,unpack}