// eslint-disable-next-line @typescript-eslint/ban-types
export const convertToType = (value: any, type: () => String | Number | Boolean) => {
	switch (type) {
		case String:
			return value;
		case Number:
			return value ? (isNaN(Number(value)) ? undefined : Number(value)) : undefined;
		case Boolean:
			return value ? Boolean(value) : undefined;
		default:
			return value;
	}
};
