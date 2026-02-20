function main() {
	console.log('BEGIN #1', new Error().stack);

	queueMicrotask(() => {
		console.log('microtask #2', new Error().stack);
		process.nextTick(() => console.log('nextTick #3', new Error().stack));
	});

	new Promise((resolve) => {
		console.log('promise init #4', new Error().stack);
		resolve();
	}).then(() => console.log('promise then #5', new Error().stack));

	setImmediate(() => console.log('setImmediate #6', new Error().stack));

	queueMicrotask(() => {
		console.log('microtask #7', new Error().stack);
		queueMicrotask(() => console.log('microtask #8', new Error().stack));
	});

	process.nextTick(() => console.log('nextTick #9', new Error().stack));

	console.log('END #10', new Error().stack);
}

main();
