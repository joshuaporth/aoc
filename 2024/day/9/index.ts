// Thanks to u/flintp for flintp.txt. The test case illustrates the mistake of moving files forward.
// The checksum should be 5768 and the disk should look like: 00000000063333333.11111...22222222................444444444..555555555.....
// https://www.reddit.com/r/adventofcode/comments/1haa13a/comment/m2aioi2/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

function compact(diskMap: string[]): void {
    const freeMem: number[] = [];
    for (let i = 0; i < diskMap.length; i++) {
        if (diskMap[i] === "") {
            freeMem.unshift(i);
        }
    }
    for (let i = diskMap.length - 1; i >= 0; i--) {
        let block = diskMap[i];
        if (block === "") {
            continue;
        }
        if (freeMem.length > 0 && freeMem[freeMem.length - 1] < i) {
            const addr = freeMem.pop()!;
            diskMap[addr] = block;
            diskMap[i] = "";
        }
    }
}

function defrag(diskMap: string[]): void {
    const fileMap = new Map<string, number[]>();
    const freeMem = new Map<number, number>();
    let startingFileId = 0;
    for (let i = 0; i < diskMap.length; i++) {
        let j = i;
        if (diskMap[i] !== "") {
            let fileId = diskMap[i];
            startingFileId = Number(fileId);
            for (; j < diskMap.length && diskMap[j] === fileId; j++) {
                fileMap.set(fileId, [i, (j - i) + 1]);
            }
        } else {
            for (; j < diskMap.length && diskMap[j] === ""; j++) {
                freeMem.set(i, (j - i) + 1);
            }
        }
        i = j - 1;
    }
    for (let fileId = startingFileId; fileId > 0; fileId--) {
        const fileIdStr = String(fileId);
        const posAndLen = fileMap.get(fileIdStr)!;
        const [pos, len] = posAndLen;
        let dest: number | undefined;
        for (const [addr, size] of freeMem) {
            if (size >= len && addr < pos && (!dest || addr < dest)) {
                dest = addr;
            }
        }

        if (dest) {
            for (let i = 0; i < len; i++) {
                diskMap[dest + i] = fileIdStr;
                diskMap[pos + i] = "";
                freeMem.set(dest + i + 1, freeMem.get(dest + i)! - 1);
                freeMem.delete(dest + i);
            }
        }
    }
}

function getChecksum(diskMap: string[]): number {
    let checksum = 0;
    for (let i = 0; i < diskMap.length; i++) {
        checksum += i * Number(diskMap[i]);
    }
    return checksum;
}

const inputPath = `${__dirname}/input.txt`;
const bunFile = Bun.file(inputPath);
let input = await bunFile.text();
input.trim();

const diskMap: string[] = [];
let file = true;
let fileId = 0;
for (const s of input.split("")) {
    const blockSize = Number(s);
    if (file) {
        for (let i = 0; i < blockSize; i++) {
            diskMap.push(`${fileId}`);
        }
        file = false;
        fileId += 1;
    } else {
        for (let i = 1; i <= blockSize; i++) {
            diskMap.push("");
        }
        file = true;
    }
}


const part1DiskMap = [...diskMap];
compact(part1DiskMap);
console.log(`Compacted Filesystem Checksum: ${getChecksum(part1DiskMap)}`);

const part2DiskMap = [...diskMap];
defrag(part2DiskMap);
console.log(`Defragmented Filesystem Checksum: ${getChecksum(part2DiskMap)}`);