// FxiOS is a WebKit shell yet resizes window.innerHeight on keyboard toggle (mozilla-mobile/firefox-ios#17929)
export const isIOSFirefox = () => /FxiOS/.test(navigator.userAgent);

// On iOS this is every engine except EU alt-engine ports (allowed since iOS 17.4) — Safari, WKWebView shells, FxiOS, CriOS all carry AppleWebKit.
export const isWebKit = () => /AppleWebKit/.test(navigator.userAgent);

export const needsIOSFixedBodyScrollLock = () =>
	/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
