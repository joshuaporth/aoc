interface Position {
    X: number;
    Y: number;
}

enum Direction {
    Up = "^",
    Down = "v",
    Left = "<",
    Right = ">"
}

enum State {
    Unvisited = ".",
    VisitedUp = Direction.Up,
    VisitedDown = Direction.Down,
    VisitedLeft = Direction.Left,
    VisitedRight = Direction.Right,
    Obstacle = "#"
}

class InfiniteLoopError extends Error {
    constructor() {
        super("Infinite Loop!");
    }
}

const handleObstacle = (pos: Position, direction: Direction) => {
    if (direction === Direction.Up) {
        pos.Y += 1;
        direction = Direction.Right;
    } else if (direction === Direction.Down) {
        pos.Y -= 1;
        direction = Direction.Left;
    } else if (direction === Direction.Left) {
        pos.X += 1;
        direction = Direction.Up;
    } else {  // Right
        pos.X -= 1;
        direction = Direction.Down;
    }
    return { pos, direction }
}

const detectInfiniteLoop = (history: string) => {
    const seen = new Set<string>();
    for (const state of history) {
        if (seen.has(state)) {
            return true;
        } else {
            seen.add(state);
        }
    }
}

const step = (map: string[][], pos: Position, direction: Direction) => {
    if (detectInfiniteLoop(map[pos.Y][pos.X])) {
        throw new InfiniteLoopError();
    }
    if (direction === Direction.Up) {
        map[pos.Y][pos.X] = map[pos.Y][pos.X] + State.VisitedUp;
        pos.Y -= 1;
    } else if (direction === Direction.Down) {
        map[pos.Y][pos.X] = map[pos.Y][pos.X] + State.VisitedDown;
        pos.Y += 1;
    } else if (direction === Direction.Left) {
        map[pos.Y][pos.X] = map[pos.Y][pos.X] + State.VisitedLeft;
        pos.X -= 1;
    } else {  // Right
        map[pos.Y][pos.X] = map[pos.Y][pos.X] + State.VisitedRight;
        pos.X += 1;
    }
    return pos;
}

const getDistinctPositions = (map: string[][], start: Position) => {
    const maxY = map.length - 1;
    const maxX = map[0].length - 1;
    let pos = { X: start.X, Y: start.Y - 1 }
    let direction = Direction.Up;
    let distinctPositions = new Map<number, Set<number>>();

    while (pos.X <= maxX && pos.X >= 0 && pos.Y <= maxY && pos.Y >= 0) {
        if (map[pos.Y][pos.X] === State.Obstacle) {
            ({ pos, direction } = handleObstacle(pos, direction));
            continue;
        }
        if (map[pos.Y][pos.X] === State.Unvisited) {
            if (distinctPositions.has(pos.X)) {
                distinctPositions.get(pos.X)?.add(pos.Y);
            } else {
                distinctPositions.set(pos.X, new Set([pos.Y]));
            }
        }
        pos = step(map, pos, direction);
    }
    return distinctPositions;
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();
const lines = input.split("\n")

let start: Position | null;
const map: string[][] = [];
for (let y = 0; y < lines.length; y++) {
    const positions = lines[y].split("");
    const maybeStartIndex = positions.findIndex((pos) => pos === "^");
    if (maybeStartIndex >= 0) {
        start = { X: maybeStartIndex, Y: y };
    }
    map.push(positions);
}

let scratch = structuredClone(map);
const distinctPositions = getDistinctPositions(scratch, start!);
let distinctPositionsCount = 1;  // Include the starting position
let infiniteLoopCount = 0;
for (const [x, ySet] of distinctPositions) {
    distinctPositionsCount += ySet.size;
    for (const y of ySet) {
        scratch = structuredClone(map);
        scratch[y][x] = State.Obstacle
        try {
            getDistinctPositions(scratch, start!)
        } catch (e) {
            if (e instanceof InfiniteLoopError) {
                infiniteLoopCount += 1;
            }
        }
    }
}

console.log(`Distinct Positions: ${distinctPositionsCount}`);
console.log(`Infinite Loop Positions: ${infiniteLoopCount}`);
