export function minimize(x0: number, f: (arg: number) => number, dx = 1e-4): number {
	let x = x0;
	let x_next = x + dx;
	while (f(x_next) < f(x)) {
		[x, x_next] = [x_next, x_next + dx];
	}
	return x;
}