const up = (i: number, j: number, puzzle: string[][]): boolean =>
	puzzle[i - 1][j] === "M" && puzzle[i - 2][j] === "A" && puzzle[i - 3][j] === "S";

const down = (i: number, j: number, puzzle: string[][]): boolean =>
	puzzle[i + 1][j] === "M" && puzzle[i + 2][j] === "A" && puzzle[i + 3][j] === "S";

const left = (i: number, j: number, puzzle: string[][]): boolean =>
	puzzle[i][j - 1] === "M" && puzzle[i][j - 2] === "A" && puzzle[i][j - 3] === "S";

const leftUp = (i: number, j: number, puzzle: string[][]): boolean =>
	puzzle[i - 1][j - 1] === "M" && puzzle[i - 2][j - 2] === "A" && puzzle[i - 3][j - 3] === "S";

const leftDown = (i: number, j: number, puzzle: string[][]): boolean =>
	puzzle[i + 1][j - 1] === "M" && puzzle[i + 2][j - 2] === "A" && puzzle[i + 3][j - 3] === "S";

const right = (i: number, j: number, puzzle: string[][]): boolean =>
	puzzle[i][j + 1] === "M" && puzzle[i][j + 2] === "A" && puzzle[i][j + 3] === "S";

const rightUp = (i: number, j: number, puzzle: string[][]): boolean =>
	puzzle[i - 1][j + 1] === "M" && puzzle[i - 2][j + 2] === "A" && puzzle[i - 3][j + 3] === "S";

const rightDown = (i: number, j: number, puzzle: string[][]): boolean =>
	puzzle[i + 1][j + 1] === "M" && puzzle[i + 2][j + 2] === "A" && puzzle[i + 3][j + 3] === "S";

const xmas = (i: number, j: number, puzzle: string[][]): boolean => {
	const topLeft = puzzle[i - 1][j - 1];
	const bottomRight = puzzle[i + 1][j + 1];
	if ((topLeft === "M" && bottomRight === "S") || (topLeft === "S" && bottomRight === "M")) {
		const topRight = puzzle[i - 1][j + 1];
		const bottomLeft = puzzle[i + 1][j - 1];
		if ((topRight === "M" && bottomLeft === "S") || (topRight === "S" && bottomLeft === "M")) {
			return true;
		}
	}
	return false;
};

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();

const lines = input.split("\n");
const puzzle = lines.map((line) => line.split(""));
const m = puzzle.length;
const n = puzzle[0].length;

let count = 0;
for (let i = 0; i < m; i++) {
	for (let j = 0; j < n; j++) {
		if (puzzle[i][j] !== "X") {
			continue;
		}
		const canSearchUp = i >= 3;
		const canSearchDown = m - i >= 4;
		if (canSearchUp) {
			count += up(i, j, puzzle) ? 1 : 0;
		}
		if (canSearchDown) {
			count += down(i, j, puzzle) ? 1 : 0;
		}
		if (j >= 3) {
			count += left(i, j, puzzle) ? 1 : 0;
			if (canSearchUp) {
				count += leftUp(i, j, puzzle) ? 1 : 0;
			}
			if (canSearchDown) {
				count += leftDown(i, j, puzzle) ? 1 : 0;
			}
		}
		if (n - j >= 4) {
			count += right(i, j, puzzle) ? 1 : 0;
			if (canSearchUp) {
				count += rightUp(i, j, puzzle) ? 1 : 0;
			}
			if (canSearchDown) {
				count += rightDown(i, j, puzzle) ? 1 : 0;
			}
		}
	}
}

console.log(`"XMAS" count: ${count}`);

let xmasCount = 0;
for (let i = 1; i < m - 1; i++) {
	for (let j = 1; j < n - 1; j++) {
		if (puzzle[i][j] === "A") {
			xmasCount += xmas(i, j, puzzle) ? 1 : 0;
		}
	}
}

console.log(`X-MAS count: ${xmasCount}`);
