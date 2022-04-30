// eslint-disable-next-line @typescript-eslint/ban-types
export const convertToType = (value: any, type: () => String | Number | Boolean | Date) => {
	switch (type) {
		case String:
			return value;
		case Number:
			return value ? (isNaN(Number(value)) ? undefined : Number(value)) : undefined;
		case Boolean:
			return value ? Boolean(value?.toLowerCase()) : undefined;
		case Date:
			return value ? new Date(value?.toLowerCase()) : undefined;
		default:
			return value;
	}
};
