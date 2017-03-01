
function consoleLog(){
	console.log("module",module);
	console.log("exports",exports);
	console.log("__filename,",__filename); // 为什么这俩not defined
	console.log("__dirname",__dirname)
}

module.exports = consoleLog