type Op = (stack: number[]) => void;

const add = (stack: number[]) => {
    const l = stack.shift()!;
    const r = stack.shift()!;
    stack.unshift(l + r);
}

const mul = (stack: number[]) => {
    const l = stack.shift()!;
    const r = stack.shift()!;
    stack.unshift(l * r);
}

const concat = (stack: number[]) => {
    const l = stack.shift()!;
    const r = stack.shift()!;
    stack.unshift(Number(l.toString() + r.toString()));
}

const permute = (ops: Op[], length: number, prefix: Op[] = []): Op[][] => {
    if (length === 0) {
        return [prefix];
    }
    const permutations = [];
    for (const op of ops) {
        const p = permute(ops, length - 1, [...prefix, op]);
        permutations.push(...p);
    }

    return permutations;
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();
const lines = input.split("\n");

const equations: number[][] = [];
for (const line of lines) {
    const parts = line.split(": ")
    const answer = Number(parts[0]);
    const nums = parts[1].split(" ").map(s => Number(s));
    equations.push([answer, ...nums])
}

let totalCalibrationResult = 0;
for (const eq of equations) {
    const testValue = eq.shift();
    const programs = permute([add, mul, concat], eq.length - 1);
    for (const p of programs) {
        const stack = structuredClone(eq);
        for (const op of p) {
            op(stack);
        }
        if (stack[0] === testValue) {
            totalCalibrationResult += testValue;
            break;
        }
    }
}

console.log(`Total Calibration Result: ${totalCalibrationResult}`);