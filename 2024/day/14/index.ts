interface Robot {
  position: { x: number, y: number };
  velocity: { x: number, y: number };
}

function parseRobot(line: string): Robot {
  const [posStr, velStr] = line.split(' ');
  const [px, py] = posStr.replace('p=', '').split(',').map(Number);
  const [vx, vy] = velStr.replace('v=', '').split(',').map(Number);

  return {
    position: { x: px, y: py },
    velocity: { x: vx, y: vy }
  };
}

function part1(positions: string[]): void {
  const robots = positions.map(parseRobot);
  for (let i = 0; i < 100; i++) {
    for (const robot of robots) {
      robot.position.x = (robot.position.x + robot.velocity.x + GRID_WIDTH) % GRID_WIDTH;
      robot.position.y = (robot.position.y + robot.velocity.y + GRID_HEIGHT) % GRID_HEIGHT;
    }
  }
  
  // Calculate middle points
  const midX = Math.floor(GRID_WIDTH / 2);
  const midY = Math.floor(GRID_HEIGHT / 2);
  
  // Count robots in each quadrant
  let quadrants = {
    NW: 0,
    NE: 0,
    SW: 0,
    SE: 0
  };
  
  for (const robot of robots) {
    const x = robot.position.x;
    const y = robot.position.y;
    
    // Skip robots in the middle row or column
    if (x === midX || y === midY) continue;
    
    // Determine quadrant
    if (x < midX) {
      if (y < midY) quadrants.NW++; // Northwest
      else quadrants.SW++; // Southwest
    } else {
      if (y < midY) quadrants.NE++; // Northeast
      else quadrants.SE++; // Southeast
    }
  }
  
  const result = Object.values(quadrants).reduce((acc, count) => acc * count, 1);
  console.log("Part 1:", result);
}

function calculateAverageDistanceToCentroid(robots: Robot[]): number {
  if (robots.length < 2) return 0;

  // Calculate centroid (average position)
  const centroid = robots.reduce(
    (acc, robot) => {
      acc.x += robot.position.x;
      acc.y += robot.position.y;
      return acc;
    },
    { x: 0, y: 0 }
  );
  
  centroid.x /= robots.length;
  centroid.y /= robots.length;

  // Calculate average distance to centroid
  const totalDistance = robots.reduce((sum, robot) => {
    const dx = robot.position.x - centroid.x;
    const dy = robot.position.y - centroid.y;
    return sum + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  return totalDistance / robots.length;
}

function visualizeGrid(robots: Robot[], gridWidth: number, gridHeight: number): string {
  // Create empty grid
  const grid: string[][] = Array(gridHeight)
    .fill(null)
    .map(() => Array(gridWidth).fill("."));
  
  // Place robots on grid
  robots.forEach((robot, index) => {
    const x = robot.position.x;
    const y = robot.position.y;
    grid[y][x] = "R";
  });
  
  // Convert grid to string
  return grid.map(row => row.join("")).join("\n");
}

function part2(positions: string[]): void {
  const robots = positions.map(parseRobot);
  let minDistance = calculateAverageDistanceToCentroid(robots);
  let iteration = 0;
  
  console.log("Initial centroid distance:", minDistance);
  console.log(visualizeGrid(robots, GRID_WIDTH, GRID_HEIGHT));
  console.log();
  
  while (true) {
    iteration++;
    
    // Move robots
    for (const robot of robots) {
      robot.position.x = (robot.position.x + robot.velocity.x + GRID_WIDTH) % GRID_WIDTH;
      robot.position.y = (robot.position.y + robot.velocity.y + GRID_HEIGHT) % GRID_HEIGHT;
    }
    
    // Calculate new distance
    const currentDistance = calculateAverageDistanceToCentroid(robots);
    
    // If we found a tighter cluster, log it
    if (currentDistance < minDistance) {
      minDistance = currentDistance;
      console.log(`New minimum centroid distance at iteration ${iteration}:`, minDistance);
      console.log(visualizeGrid(robots, GRID_WIDTH, GRID_HEIGHT));
      console.log();
    }
  }
}

const inputPath = `${__dirname}/input.txt`;
const input = await Bun.file(inputPath).text();
const lines = input.trim().split("\n");

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

part1(lines);
part2(lines);

