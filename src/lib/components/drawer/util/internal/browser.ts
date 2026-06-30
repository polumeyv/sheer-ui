export function isMobileFirefox(): boolean | undefined {
	const userAgent = navigator.userAgent;
	return (
		typeof window !== 'undefined' &&
		((/Firefox/.test(userAgent) && /Mobile/.test(userAgent)) || // Android Firefox
			/FxiOS/.test(userAgent)) // iOS Firefox
	);
}

export const needsIOSFixedBodyScrollLock = () => {
	if (typeof navigator === 'undefined') return false;

	const ua = navigator.userAgent;

	return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};
