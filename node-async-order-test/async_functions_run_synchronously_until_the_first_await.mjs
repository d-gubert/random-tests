import { setTimeout } from 'timers/promises';

const context = [];

async function run() {
	context.push(1);

	await setTimeout(500);

	return context.push(3);
}

console.log(context);

const p = run();

console.log(context);

const r = await p;

console.log({context,r});

await p;

console.log('alo')

