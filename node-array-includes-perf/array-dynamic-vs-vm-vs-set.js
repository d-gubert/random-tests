// Performance comparison: Dynamic array vs Compiled VM script with OR chain
const vm = require('vm');

// Generate a couple hundred random values
const ARRAY_SIZE = 200;
const validValues = [];

for (let i = 0; i < ARRAY_SIZE; i++) {
	validValues.push(`value-${i}-${Math.random().toString(36).substring(7)}`);
}

console.log('Setup:');
console.log(`  Array size: ${ARRAY_SIZE} elements`);
console.log(`  Sample values: ${validValues.slice(0, 3).join(', ')}...`);

// Implementation 1: Array.includes() with dynamic array
function createArrayIncludesChecker(values) {
	return function(input) {
		if (!values.includes(input)) {
			return null;
		}
		return true;
	};
}

// Implementation 2: Compiled VM script with OR chain
function createCompiledChecker(values) {
	// Build the OR comparison chain
	const conditions = values.map(val => `input !== ${JSON.stringify(val)}`).join(' && \n    ');
	
	const code = `
		(function(input) {
			if (${conditions}) {
				return null;
			}
			return true;
		})
	`;
	
	// Compile the script
	const script = new vm.Script(code);
	const compiledFunction = script.runInThisContext();
	
	return compiledFunction;
}

// Implementation 3: Object lookup (for comparison)
function createObjectLookupChecker(values) {
	const lookupObj = {};
	for (const val of values) {
		lookupObj[val] = true;
	}
	
	return function(input) {
		if (!lookupObj[input]) {
			return null;
		}
		return true;
	};
}

// Implementation 4: Set lookup (modern approach)
function createSetLookupChecker(values) {
	const lookupSet = new Set(values);
	
	return function(input) {
		if (!lookupSet.has(input)) {
			return null;
		}
		return true;
	};
}

console.log('Creating checker functions...');

const arrayChecker = createArrayIncludesChecker(validValues);
const compiledChecker = createCompiledChecker(validValues);
const objectChecker = createObjectLookupChecker(validValues);
const setChecker = createSetLookupChecker(validValues);

console.log('✓ All checkers created');

// Test data: mix of valid values and invalid values
const testCases = [
	...validValues.slice(0, 20), // 20 valid values (from start)
	...validValues.slice(Math.floor(ARRAY_SIZE / 2), Math.floor(ARRAY_SIZE / 2) + 20), // 20 valid values (from middle)
	...validValues.slice(-20), // 20 valid values (from end)
	'invalid-1',
	'invalid-2',
	'invalid-3',
	'invalid-4',
	'invalid-5',
	'not-found',
	'random-value',
	'does-not-exist',
	'nope',
	'wrong-value'
];

console.log(`Test cases: ${testCases.length} values (${testCases.length - 10} valid, 10 invalid)`);

// Number of iterations
const ITERATIONS = 1000000;

console.log('Performance Comparison: Dynamic Array Check');
console.log('='.repeat(60));
console.log(`Iterations: ${ITERATIONS.toLocaleString()}`);
console.log('='.repeat(60));

// Benchmark function
function benchmark(name, fn) {
	const start = process.hrtime.bigint();
	
	for (let i = 0; i < ITERATIONS; i++) {
		const testCase = testCases[i % testCases.length];
		fn(testCase);
	}
	
	const end = process.hrtime.bigint();
	const duration = Number(end - start) / 1000000; // Convert to milliseconds
	
	console.log(`${name}:`);
	console.log(`  Time: ${duration.toFixed(2)} ms`);
	console.log(`  Ops/sec: ${(ITERATIONS / (duration / 1000)).toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
	
	return duration;
}

// Run benchmarks
const time1 = benchmark('1. Array.includes() with dynamic array', arrayChecker);
const time2 = benchmark('2. Compiled VM script with OR chain', compiledChecker);
const time3 = benchmark('3. Object lookup', objectChecker);
const time4 = benchmark('4. Set.has() lookup', setChecker);

// Calculate relative performance
console.log('='.repeat(60));
console.log('Relative Performance:');
console.log('='.repeat(60));

const fastest = Math.min(time1, time2, time3, time4);
console.log(`Implementation 1 (Array.includes): ${(time1 / fastest).toFixed(2)}x`);
console.log(`Implementation 2 (Compiled OR chain): ${(time2 / fastest).toFixed(2)}x`);
console.log(`Implementation 3 (Object lookup): ${(time3 / fastest).toFixed(2)}x`);
console.log(`Implementation 4 (Set.has): ${(time4 / fastest).toFixed(2)}x`);

const implementations = [
	{ name: 'Array.includes() with dynamic array', time: time1 },
	{ name: 'Compiled VM script with OR chain', time: time2 },
	{ name: 'Object lookup', time: time3 },
	{ name: 'Set.has() lookup', time: time4 }
];

const winner = implementations.reduce((prev, curr) => prev.time < curr.time ? prev : curr);

console.log(`✓ Winner: ${winner.name}`);

// Show the compiled code size
const sampleConditions = validValues.slice(0, 3).map(val => `input !== ${JSON.stringify(val)}`).join(' && ');

console.log('='.repeat(60));
console.log('Compiled OR chain sample (first 3 conditions):');
console.log('='.repeat(60));
console.log(`if (${sampleConditions} && ...)`);
