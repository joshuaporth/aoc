const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
const input = await bunFile.text();

const left = new Array<number>();
const right = new Array<number>();
const rightFreq = new Map<number, number>();
const lines = input.split("\n");
for await (const line of lines) {
	const nums = line.split("  ").map((s) => Number(s));
	left.push(nums[0]);
	right.push(nums[1]);
	rightFreq.set(nums[1], (rightFreq.get(nums[1]) || 0) + 1);
}

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

let distance = 0;
let similarity = 0;
for (let i = 0; i < left.length; i++) {
	distance += Math.abs(left[i] - right[i]);
	similarity += left[i] * (rightFreq.get(left[i]) || 0);
}
console.log(`Total Distance: ${distance}`);
console.log(`Similarity Score: ${similarity}`);
