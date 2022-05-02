export function replace<T>(array: T[], value: T, predicate: (item: T) => boolean): T[] {
	return array.map((item) => predicate(item) ? value : item);
}