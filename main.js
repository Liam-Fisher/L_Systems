const Max = require("max-api");
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});
  
rl.on('line', async function(line) {
    await Max.outlet('MESSAGE', line);
});

const Laboratory  = require("./js_src/design/laboratory").Laboratory;
const src = require(process.argv[2]);
const lab = new Laboratory();
lab.init(src);
const handlers = {
	load: async (...args) => await Max.outlet(...lab.init(args)),
	generate: async (id) => await Max.outlet(...lab.generate(id)),
	// id, target Map, target string
	query: async (queryTgt, ...args) => await Max.outlet(...lab.query(queryTgt, ...args)),
	edit: async (...args) => {
		await Max.outlet("ERROR", "edit function called :(");
	},

};
Max.addHandlers(handlers);


