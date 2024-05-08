let globalUserJsAndCssToggle = true;

const element = document.querySelector('html')
if (globalUserJsAndCssToggle) {
	element.setAttribute('data-user-js-and-css-toggle', '')
}

setInterval(function() {
	const element = document.querySelector('html')
	const attr = element.getAttribute('data-user-js-and-css-toggle')
	if (attr === '' && !globalUserJsAndCssToggle) {
		element.removeAttribute('data-user-js-and-css-toggle')
	} else if (attr === null && globalUserJsAndCssToggle) {
		element.setAttribute('data-user-js-and-css-toggle', '')
	}
}, 500);