function countNinerTrails(i: number, j: number, topoMap: number[][], step: number = 0): number {
	if (topoMap[i] === undefined || topoMap[i][j] === undefined || topoMap[i][j] !== step) {
		return 0;
	}
	if (step === 9) {
		return 1;
	}
	let count = 0;
	count += countNinerTrails(i + 1, j, topoMap, step + 1);
	count += countNinerTrails(i - 1, j, topoMap, step + 1);
	count += countNinerTrails(i, j + 1, topoMap, step + 1);
	count += countNinerTrails(i, j - 1, topoMap, step + 1);
	return count;
}

function countReachablePeeks(
	i: number,
	j: number,
	topoMap: number[][],
	peeks: Set<number> = new Set(),
	step: number = 0,
): number {
	if (topoMap[i] === undefined || topoMap[i][j] === undefined || topoMap[i][j] !== step) {
		return 0;
	}
	if (step === 9) {
		const loc = topoMap.length * i + j;
		if (!peeks.has(loc)) {
			peeks.add(loc);
			return 1;
		}
	}
	let count = 0;
	count += countReachablePeeks(i + 1, j, topoMap, peeks, step + 1);
	count += countReachablePeeks(i - 1, j, topoMap, peeks, step + 1);
	count += countReachablePeeks(i, j + 1, topoMap, peeks, step + 1);
	count += countReachablePeeks(i, j - 1, topoMap, peeks, step + 1);
	return count;
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();
let lines = input.trim().split("\n");

const topoMap: number[][] = [];
for (const line of lines) {
	topoMap.push(line.split("").map((s) => Number(s)));
}

let sumOfScores = 0;
let sumOfRatings = 0;
for (let i = 0; i < topoMap.length; i++) {
	for (let j = 0; j < topoMap[i].length; j++) {
		if (topoMap[i][j] === 0) {
			sumOfScores += countReachablePeeks(i, j, topoMap);
			sumOfRatings += countNinerTrails(i, j, topoMap);
		}
	}
}

console.log(`Sum of the scores of all trailheads: ${sumOfScores}`);
console.log(`Sum of the ratings of all trailheads: ${sumOfRatings}`);
