enum Direction {
    Up,
    Down
};

interface Position {
    X: number,
    Y: number
};

class AntennaMap {
    #map: string[][];
    #width: number;
    #height: number;

    constructor(map: string) {
        this.#map = [];
        const rows = map.split("\n");
        for (const row of rows) {
            this.#map.push(row.split(""));
        }
        this.#height = rows.length;
        this.#width = rows[0].length;
    }

    #getNodes(): Map<string, Position[]> {
        const nodes = new Map<string, Position[]>();
        for (let i = 0; i < this.#map.length; i++) {
            const row = this.#map[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] !== ".") {
                    const pos = { X: j, Y: i };
                    if (nodes.has(row[j])) {
                        nodes.get(row[j])!.push(pos);
                    } else {
                        nodes.set(row[j], [pos])
                    }
                }
            }
        }
        return nodes;
    }

    #getAddress(pos: Position) {
        return ((pos.Y - 1) * this.#width - 1) + pos.X;
    }

    #isOnMap(pos: Position): boolean {
        return pos.X >= 0 && pos.X <= this.#width - 1 && pos.Y >= 0 && pos.Y <= this.#height - 1;
    }

    findAntinodes(findResonantNodes: boolean = false) {
        const nodes = this.#getNodes();
        const antinodes: Position[] = [];
        const seen = new Set<number>();
        for (const freq of nodes.keys()) {
            const freqNodes = nodes.get(freq)!;
            for (let i = 0; i < freqNodes.length; i++) {
                const a = freqNodes[i];
                for (const b of freqNodes.slice(i + 1)) {
                    if (findResonantNodes) {
                        for (const p of [a, b]) {
                            let address = this.#getAddress(p);
                            if (!seen.has(address)) {
                                antinodes.push(p);
                                seen.add(address);
                            }
                        }
                    }
                    const xDiff = Math.abs(a.X - b.X);
                    const yDiff = Math.abs(a.Y - b.Y);
                    let harmonic = 1;
                    do {
                        const antinodeA: Position = {
                            X: (a.X < b.X) ? a.X - xDiff * harmonic : a.X + xDiff * harmonic,
                            Y: (a.Y < b.Y) ? a.Y - yDiff * harmonic : a.Y + yDiff * harmonic
                        };
                        if (this.#isOnMap(antinodeA)) {
                            const address = this.#getAddress(antinodeA);
                            if (!seen.has(address)) {
                                antinodes.push(antinodeA);
                                seen.add(address);
                            }
                        } else {
                            break;
                        }
                        harmonic += 1;
                    } while (findResonantNodes);
                    harmonic = 1;
                    do {
                        const antinodeB: Position = {
                            X: (a.X < b.X) ? b.X + xDiff * harmonic : b.X - xDiff * harmonic,
                            Y: (a.Y < b.Y) ? b.Y + yDiff * harmonic : b.Y - yDiff * harmonic
                        };
                        if (this.#isOnMap(antinodeB)) {
                            const address = this.#getAddress(antinodeB);
                            if (!seen.has(address)) {
                                antinodes.push(antinodeB);
                                seen.add(address);
                            }
                        } else {
                            break;
                        }
                        harmonic += 1;
                    } while (findResonantNodes);
                }
            }
        }
        return antinodes;
    }
}


const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();

const map = new AntennaMap(input);

const antinodes = map.findAntinodes();
console.log(`Antinodes: ${antinodes.length}`);

const resonantAntinodes = map.findAntinodes(true);
console.log(`Antinodes w/ Resonant Harmonics: ${resonantAntinodes.length}`);