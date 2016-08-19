var codec=require("./codec");
var p=codec.pack("t01p0016c0707");
var p2=codec.pack("t01p0016c0910");

var fetch=require("./fetch");

var r=fetch.fromto(p,p2);
if (r=="阿難受教，宣令普集。阿難\n白佛：「大眾已集，唯聖知時。」爾時，世尊即詣\n講堂，就座而坐，告諸比丘：「") {
	console.log("pass")
} else {
	console.log("error fetch",r);
}