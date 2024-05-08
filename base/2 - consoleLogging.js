// Depends on:
// globalToggle

let doLogging = false;

function consolelog(...args) {
	if (doLogging && globalUserJsAndCssToggle) {
		console.log(...args)
	}
}