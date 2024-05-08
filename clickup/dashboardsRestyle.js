
const rowColSpanRegexp = new RegExp(/translate3d\((?<left>\d+(?:\.\d+)?)px, (?<top>\d+(?:\.\d+)?)px, 0px\); width: (?<width>\d+(?:\.\d+)?)px; height: (?<height>\d+(?:\.\d+)?)px;/)

const widgetRowHeight = 150;
const widgetGridSpacing = 16;
function getWidgetRowColumnSpan(widgetElement, columnWidth) {
	if (!widgetElement) {
		consolelog("getWidgerRowColumnSpan widgetElement not truthy")
		return false;
	}
	
	const style = widgetElement.getAttribute('style')
	if (!style) {
		consolelog("getWidgetRowColumnSpan style not truthy")
		return false;
	}
	
	const match = style.match(rowColSpanRegexp)
		consolelog("getWidgetRowColumnSpan style does not match regex")
	if (!match) {
		return false;
	}
	
	const groups = match.groups
	if (!groups) {
		consolelog("getWidgetRowColumnSpan style no groups found in regex")
		return false;
	}
	
	const {top, left, width, height} = groups
	
	const col = Math.round(1 + (Number(left)) / (widgetGridSpacing + columnWidth));
	const colSpan = Math.round((Number(width) + widgetGridSpacing) / (widgetGridSpacing + columnWidth));
	const row = Math.round(1 + (Number(top)) / (widgetGridSpacing + widgetRowHeight))
	const rowSpan = Math.round((Number(height) + widgetGridSpacing) / (widgetGridSpacing + widgetRowHeight));
	
	let styleStr = "";
	styleStr += widgetElement.getAttribute('data-orig-style') ?? style;
	styleStr += `--col-start: ${col};`;
	styleStr += `--col-end: ${col + colSpan};`;
	styleStr += `--row-start: ${row};`;
	styleStr += `--row-end: ${row + rowSpan};`;
	
	widgetElement.setAttribute('data-orig-style', style)
	widgetElement.setAttribute('style', styleStr)
}

function adjustWidgetPosition() {
	console.log("adjustWidgetPosition -- start");
	const gridParent = document.querySelector('cu-grid-dashboard gridster')
	if (!gridParent) {
		return;
	}
	
	const items = gridParent.querySelectorAll('& > gridster-item')
	if (!items || !items.length) {
		return;
	}
	
	const computedStyles = gridParent.computedStyleMap()
	const gridParentInlinePadding = 40
	
	const colWidth = (gridParent.clientWidth - gridParentInlinePadding - (16 * (12 - 1))) / 12
	
	items.forEach(el => getWidgetRowColumnSpan(el, colWidth))
	console.log("adjustWidgetPosition -- end");
}

async function setupDashboardWidgetEventListener() {
	let disconnectFunc = () => {}
	onElementCreation('[data-user-js-and-css-toggle] cu-grid-dashboard gridster gridster-item[style*="width"]', adjustWidgetPosition);
}

setupDashboardWidgetEventListener()