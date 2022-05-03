export function sum(array: number[]): number {
	return array.reduce((sum, add) => sum + add, 0);
}