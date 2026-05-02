export const updatedTask = (data: any) => {
	return Object.fromEntries(
		Object.entries(data as any).filter(
			([_, value]) =>
				value !== undefined &&
				value !== null &&
				value !== '',
		),
	);
};
