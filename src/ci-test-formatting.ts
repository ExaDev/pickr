// File to test CI auto-formatting (pre-commit disabled)
export const badlyFormattedFunction = (a: string, b: number) => {
	const obj = { prop1: a, prop2: b };
	if (obj.prop2 > 10) {
		return obj.prop1;
	}
	return 'default';
};

export const arrayFunction = () => {
	const items = [1, 2, 3];
	return items.filter(x => x > 1).map(y => y * 3);
};
