// Test file with intentional formatting issues
export const testFunction = (param1: string, param2: number) => {
	const result = {
		value1: param1,
		value2: param2,
	};

	if (result.value2 > 0) {
		return result;
	}

	return null;
};

export const anotherFunction = () => {
	const array = [1, 2, 3, 4, 5];
	return array.map(item => item * 2);
};
