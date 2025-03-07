function countStonesAfterBlinking(stones: string[], n: number): Promise<number> {
	return new Promise((resolve) => {
		let count = 0;
		let workers = stones.length;
		for (const s of stones) {
			const w = new Worker(`${__dirname}/worker.ts`);
			w.postMessage({
				stone: s,
				blinks: n,
			});
			w.onmessage = (ev: MessageEvent) => {
				count += ev.data;
				w.unref();
				workers -= 1;
				if (workers === 0) {
					resolve(count);
				}
			};
		}
	});
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();

const stones = input.split(" ");

let blinks = 25;
countStonesAfterBlinking(stones, blinks).then((count) => {
	console.log(`Stones after blinking ${blinks} times: ${count}`);
});

blinks = 75;
countStonesAfterBlinking(stones, blinks).then((count) => {
	console.log(`Stones after blinking ${blinks} times: ${count}`);
});
