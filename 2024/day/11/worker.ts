declare var self: Worker;

function countStonesAfterBlinking(stone: string, blinks: number): number {
	let stones = new Map<string, number>();
	stones.set(stone, 1);
	while (blinks > 0) {
		const next = new Map<string, number>();
		for (const [s, n] of stones) {
			if (s === "0") {
				next.set("1", (next.get("1") ?? 0) + n);
			} else if (s.length % 2 === 0) {
				const middle = s.length / 2;
				const left = s.substring(0, middle);
				const right = Number(s.substring(middle)).toString();
				next.set(left, (next.get(left) ?? 0) + n);
				next.set(right, (next.get(right) ?? 0) + n);
			} else {
				const mark = (Number(s) * 2024).toString();
				next.set(mark, (next.get(mark) ?? 0) + n);
			}
		}
		stones = next;
		blinks -= 1;
	}
	let count = 0;
	for (const [s, n] of stones) {
		count += n;
	}
	return count;
}

self.onmessage = (event: MessageEvent) => {
	const stone = event.data.stone;
	const blinks = event.data.blinks;
	const count = countStonesAfterBlinking(stone, blinks);
	postMessage(count);
};
