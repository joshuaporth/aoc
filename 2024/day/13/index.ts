import BigNumber from "bignumber.js"

interface Config {
    X: BigNumber,
    Y: BigNumber
}

interface ButtonPresses {
    A: BigNumber,
    B: BigNumber
}

function parseButton(buttonConfigStr: string): Config {
    const matcher = /Button .: X\+(?<X>[1-9][0-9]*), Y\+(?<Y>[1-9][0-9]*)/;
    const buttonConfig = buttonConfigStr.match(matcher);
    return {
        X: new BigNumber(buttonConfig!.groups!.X),
        Y: new BigNumber(buttonConfig!.groups!.Y)
    };
}

function parsePrize(prizeConfgiStr: string, correction: BigNumber = new BigNumber(0)): Config {
    const matcher = /Prize: X=(?<X>[1-9][0-9]*), Y=(?<Y>[1-9][0-9]*)/;
    const prizeConfig = prizeConfgiStr.match(matcher);
    return {
        X: correction.plus(new BigNumber(prizeConfig!.groups!.X)),
        Y: correction.plus(new BigNumber(prizeConfig!.groups!.Y))
    };
}

function round(n: BigNumber): BigNumber {
    return BigNumber(n.toNumber());
}

// Detect Integers with FP percision errors like "42.000...01" and "41.999..."
function isBasicallyInt(n: BigNumber): boolean {
    return n.isInteger() || round(n).isInteger();
}

/*
 * I used a system of equations to solve for a and b.
 * Split the configs into 2 equations, one solving for X and the other for Y
 * 
 * For example, this config
 *     Button A: X+94, Y+34
 *     Button B: X+22, Y+67
 *     Prize: X=8400, Y=5400
 * becomes
 *     eq1: 94a + 22b = 8400
 *     eq2: 34a + 67b = 5400
 * 
 * I then solved for a in eq1 and substituted the result for a in eq2 and solved eq2 for b.
 * If the prize is reachable a and b will be integers (taking into account FP percision)
 */
function solve(eq1: Config, eq2: Config, p: Config): ButtonPresses | undefined {
    const B = p.Y.minus(eq1.Y.times(p.X).div(eq1.X)).div(eq1.Y.times(eq2.X).div(eq1.X).negated().plus(eq2.Y));
    const A = p.X.minus(eq2.X.times(B)).div(eq1.X);
    if (isBasicallyInt(A) && isBasicallyInt(B)) {
        return { A, B };
    }
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();
const configs = input.split("\n\n");

let fewestTokensNeeded = new BigNumber(0);
let correctedFewestTokensNeeded = new BigNumber(0);
for (const c of configs) {
    const lines = c.split("\n");
    const buttonAConfig = parseButton(lines.shift()!);
    const buttonBConfig = parseButton(lines.shift()!);
    const prizeConfigStr = lines.shift()!;
    const prizeConfig = parsePrize(prizeConfigStr);
    const correctPrizeConfig = parsePrize(prizeConfigStr, new BigNumber(10000000000000));
    let buttonPresses = solve(buttonAConfig, buttonBConfig, prizeConfig);
    if (buttonPresses) {
        fewestTokensNeeded = buttonPresses.A.times(new BigNumber(3)).plus(buttonPresses.B).plus(fewestTokensNeeded);
    }
    buttonPresses = solve(buttonAConfig, buttonBConfig, correctPrizeConfig);
    if (buttonPresses) {
        correctedFewestTokensNeeded = buttonPresses.A.times(new BigNumber(3)).plus(buttonPresses.B).plus(correctedFewestTokensNeeded);
    }
}

console.log(`Fewest tokens needed to win all possible prizes: ${round(fewestTokensNeeded)}`);
console.log(`Corrected fewest tokens needed to win all possible prizes: ${round(correctedFewestTokensNeeded)}`);