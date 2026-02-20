// Performance comparison of different content-type checking implementations

// Implementation 1: Array created inside function (original)
function isJsonContent1(contentType) {
	if (!['application/json', 'text/javascript', 'application/javascript', 'application/x-javascript'].includes(contentType)) {
		return null;
	}
	return true;
}

// Implementation 2: Array created outside function
const jsonContentTypes = ['application/json', 'text/javascript', 'application/javascript', 'application/x-javascript'];

function isJsonContent2(contentType) {
	if (!jsonContentTypes.includes(contentType)) {
		return null;
	}
	return true;
}

// Implementation 3: Using OR operators with string primitives
function isJsonContent3(contentType) {
	if (contentType !== 'application/json' && 
	    contentType !== 'text/javascript' && 
	    contentType !== 'application/javascript' && 
	    contentType !== 'application/x-javascript') {
		return null;
	}
	return true;
}

// Implementation 4: Object lookup with keys
const jsonContentTypesObj = {
	'application/json': true,
	'text/javascript': true,
	'application/javascript': true,
	'application/x-javascript': true
};

function isJsonContent4(contentType) {
	if (!jsonContentTypesObj[contentType]) {
		return null;
	}
	return true;
}

// Test data: mix of matching and non-matching content types
const testCases = [
	'application/json',
	'text/javascript',
	'application/javascript',
	'application/x-javascript',
	'text/html',
	'application/xml',
	'text/plain',
	'image/png',
	'application/octet-stream',
	'text/css'
];

// Number of iterations for each test
const ITERATIONS = 10_000_000;

console.log('Performance Comparison: Content-Type Checking');
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
const time1 = benchmark('1. Array.includes() - array inside function', isJsonContent1);
const time2 = benchmark('2. Array.includes() - array outside function', isJsonContent2);
const time3 = benchmark('3. OR operators with string primitives', isJsonContent3);
const time4 = benchmark('4. Object lookup with keys', isJsonContent4);

// Calculate relative performance
console.log('='.repeat(60));
console.log('Relative Performance:');
console.log('='.repeat(60));

const fastest = Math.min(time1, time2, time3, time4);
console.log(`Implementation 1 (array inside): ${(time1 / fastest).toFixed(2)}x`);
console.log(`Implementation 2 (array outside): ${(time2 / fastest).toFixed(2)}x`);
console.log(`Implementation 3 (OR operators): ${(time3 / fastest).toFixed(2)}x`);
console.log(`Implementation 4 (object lookup): ${(time4 / fastest).toFixed(2)}x`);

const implementations = [
	{ name: 'OR operators with string primitives', time: time3 },
	{ name: 'Array.includes() with array outside function', time: time2 },
	{ name: 'Array.includes() with array inside function', time: time1 },
	{ name: 'Object lookup with keys', time: time4 }
];

const winner = implementations.reduce((prev, curr) => prev.time < curr.time ? prev : curr);

console.log(`✓ Winner: ${winner.name}`);
