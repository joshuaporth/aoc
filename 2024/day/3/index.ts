function computeResult(memory: string): number {
    let result = 0;
    const re = new RegExp(/mul\((?<X>[0-9]{1,3}),(?<Y>[0-9]{1,3})\)/g);
    let mul: RegExpExecArray | null = null;
    while (mul = re.exec(memory)) {
        result += Number(mul?.groups?.X) * Number(mul?.groups?.Y);
    }
    return result;
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();

input = input.replaceAll("\n", "");

console.log(`Result: ${computeResult(input)}`);

const chunks = input.split("don't()");
const first = chunks.shift()!;
let resWithCondStmts = computeResult(first);
for (const chunk of chunks) {
    const dontAndDos = chunk.split("do()");
    dontAndDos.shift(); // Remove the don't() memory
    for (const mem of dontAndDos) {
        resWithCondStmts += computeResult(mem);
    }
}

console.log(`Result w/ Conditional Statements: ${resWithCondStmts}`);