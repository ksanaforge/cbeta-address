var codec=require("./codec");
var input="01p0301b0302";
var r=codec.pack(input);
var s=codec.unpack(r);
if (input!==s) {
	console.log("error");
} else {
	console.log("pass");
}
