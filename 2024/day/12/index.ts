interface Size {
	Area: number;
	Perimeter: number;
	Sides: number;
}

function getCoordinate(i: number, j: number, garden: string[][]): number {
	return garden.length * i + j;
}

function countCorners(i: number, j: number, garden: string[][], plot: string): number {
	let result = 0;
	const up = i - 1 >= 0 ? garden[i - 1][j] === plot : false;
	const down = i + 1 < garden.length ? garden[i + 1][j] === plot : false;
	const left = j - 1 >= 0 ? garden[i][j - 1] === plot : false;
	const right = j + 1 < garden[0].length ? garden[i][j + 1] === plot : false;

	// Outside corners
	result += !up && !left ? 1 : 0;
	result += !up && !right ? 1 : 0;
	result += !down && !left ? 1 : 0;
	result += !down && !right ? 1 : 0;

	// Inside corners
	result += up && left && garden[i - 1][j - 1] !== plot ? 1 : 0;
	result += up && right && garden[i - 1][j + 1] !== plot ? 1 : 0;
	result += down && left && garden[i + 1][j - 1] !== plot ? 1 : 0;
	result += down && right && garden[i + 1][j + 1] !== plot ? 1 : 0;

	return result;
}

function analyzePlot(plot: string, garden: string[][], i: number, j: number, mem: Set<number> = new Set()): Size {
	const size: Size = { Area: 0, Perimeter: 0, Sides: 0 };
	const coord = getCoordinate(i, j, garden);
	if (mem.has(coord)) {
		return size;
	}
	if (i >= 0 && i < garden.length && j >= 0 && j < garden[i].length && garden[i][j] === plot) {
		mem.add(coord);
		size.Area += 1;
	} else {
		size.Perimeter = 1;
		return size;
	}

	const down = analyzePlot(plot, garden, i + 1, j, mem);
	size.Area += down.Area;
	size.Perimeter += down.Perimeter;
	size.Sides += down.Sides;

	const right = analyzePlot(plot, garden, i, j + 1, mem);
	size.Area += right.Area;
	size.Perimeter += right.Perimeter;
	size.Sides += right.Sides;

	const up = analyzePlot(plot, garden, i - 1, j, mem);
	size.Area += up.Area;
	size.Perimeter += up.Perimeter;
	size.Sides += up.Sides;

	const left = analyzePlot(plot, garden, i, j - 1, mem);
	size.Area += left.Area;
	size.Perimeter += left.Perimeter;
	size.Sides += left.Sides;

	size.Sides += countCorners(i, j, garden, plot);

	return size;
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();

const garden = input.split("\n").map((r) => r.split(""));

let price = 0;
let discountPrice = 0;
let seen = new Set<number>();
for (let i = 0; i < garden.length; i++) {
	for (let j = 0; j < garden[i].length; j++) {
		const coord = getCoordinate(i, j, garden);
		if (!seen.has(coord)) {
			const mem = new Set<number>();
			const size = analyzePlot(garden[i][j], garden, i, j, mem);
			seen = new Set([...seen, ...mem]);
			price += size.Area * size.Perimeter;
			discountPrice += size.Area * size.Sides;
		}
	}
}

console.log(`Price of fencing all regions: ${price}`);
console.log(`Discounted price of fencing all regions: ${discountPrice}`);
