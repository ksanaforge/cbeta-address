/* save and load taisho line text effectively */
var codec=require("./codec");
var fs=require("fs");
var output=[
/*
	vol:[
		[ //first page
			'',//first line
			'',//second line
		],
		[,//second page

		]
	]


*/
];

var addLine=function(text,pointer){
	var r=codec.decompose(pointer);
	if (!output[r.page-1])output[r.page-1]=[];
	var pos=(r.side*29)+r.line;//if times 32, 3 extra null
	output[r.page-1][pos-1]=text.trim();
}

var toString=function(out){
	for (var p=0;p<out.length;p++) {
		if (!out[p]) out[p]="null";
		else out[p]="`"+out[p].join("\n")+"`";
	}
	return "module.exports=["+out.join(",\n")+"]";
}
var write=function(fn){
	console.log("writing to "+fn);	
	fs.writeFileSync(fn,toString(output),"utf8");
	output=[];
}
module.exports={addLine,write};