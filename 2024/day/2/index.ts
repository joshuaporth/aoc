function hasError(report: number[]): number {
    const isSafeLevel = (prev: number, curr: number, dir: number) => {
        const diff = curr - prev;
        const newDir = diff > 0 ? 1 : -1;
        const change = Math.abs(diff);
        return newDir === dir && change >= 1 && change <= 3;
    }
    let dir = report[1] - report[0] > 0 ? 1 : -1;
    if (dir === 0 || !isSafeLevel(report[0], report[1], dir)) {
        return 1;
    }
    for (let i = 2; i < report.length; i++) {
        if (!isSafeLevel(report[i - 1], report[i], dir)) {
            return i;
        }
    }
    return 0;
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
const input = await bunFile.text();

const lines = input.split("\n");
let safe = 0;
let safeWithTolerance = 0;
for await (const line of lines) {
    const report = line.split(" ").map(s => Number(s));
    const error = hasError(report);
    if (!error) {
        safe += 1;
    } else {
        for (let i = 0; i <= error; i++) {
            const skipLevel = report.splice(i,1);
            if (!hasError(report)) {
                safeWithTolerance += 1;
                break;
            } else {
                report.splice(i, 0, skipLevel[0]);
            }
        }
    }
}

console.log(`Safe Reports: ${safe}`);
console.log(`Safe Reports w/ Problem Dampener: ${safe + safeWithTolerance}`);