export const formatUSD = (cents: number): string =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
