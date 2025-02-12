const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();

const sections = input.split(/\n\n/);

const rules = sections[0].split("\n").reduce((prev, curr) => {
    const pages = curr.split("|");
    if (prev.has(pages[0])) {
        prev.get(pages[0])?.add(pages[1]);
    } else {
        prev.set(pages[0], new Set([pages[1]]));
    }
    return prev;
}, new Map<string, Set<string>>());

const updatesInput = sections[1].split("\n");

const incorrectlyOrderedUpdates = new Array<string[]>();
let correctlyOrderedSum = 0;
for (const updateStr of updatesInput) {
    const update = updateStr.split(",");
    const seen = new Set<string>();
    let error = false;
    for (const page of update) {
        if (rules.has(page)) {
            error = seen.intersection(rules.get(page)!).size !== 0;
            if (error) {
                incorrectlyOrderedUpdates.push(update);
                break;
            }
        }
        seen.add(page);
    }
    if (!error) {
        const middle = update[Math.floor(update.length / 2)];
        correctlyOrderedSum += Number(middle);
    }
}

console.log(`Correctly-ordered update sum: ${correctlyOrderedSum}`);

let fixedOrderSum = 0;
for (const update of incorrectlyOrderedUpdates) {
    let incorrect = true;
    while (incorrect) {
        let errors = new Set<string>();
        const seen = new Set<string>();
        for (let i = 0; i < update.length; i++) {
            if (rules.has(update[i])) {
                errors = seen.intersection(rules.get(update[i])!);
                if (errors.size !== 0) {
                    let firstError = update.length;
                    for (const err of errors.values()) {
                        const pos = update.indexOf(err);
                        firstError = Math.min(firstError, pos);
                    }
                    const incorrectPage = update.splice(i, 1)[0];
                    update.splice(firstError, 0, incorrectPage);
                    break;
                }
            }
            seen.add(update[i]);
        }
        if (errors.size === 0) {
            incorrect = false;
            const middle = update[Math.floor(update.length / 2)];
            fixedOrderSum += Number(middle);
        }
    }
}

console.log(`Fixed order update sum: ${fixedOrderSum}`);
