export function isMobileFirefox(): boolean | undefined {
	const userAgent = navigator.userAgent;
	return (
		typeof window !== "undefined" &&
		((/Firefox/.test(userAgent) && /Mobile/.test(userAgent)) || // Android Firefox
			/FxiOS/.test(userAgent)) // iOS Firefox
	);
}

export function isSafari(): boolean | undefined {
	return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
