var codec=require("./codec");

var p1=codec.pack('01p0001c2900');
var p2=codec.pack('01p0002a0300');

console.log("distance",codec.lineDistance(p1,p2));