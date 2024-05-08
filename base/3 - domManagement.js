// Depends on:
// globalToggle
// consoleLogging

function onDomChange(elementQuery, callback, all = false, config = { attributes: true, childList: true, subtree: true }) {
	try {
		// Query all nodes.
		const nodes = document.querySelectorAll(`:has(> ${elementQuery}), ${elementQuery}`);
		if (!nodes.length) {
			return false;
		}
		// Select either all or first depending on `all` flag.
		const nodesArr = Array.from(nodes).slice(0, all ? nodes.length : 1);
		
		// Setup observer.
		var observer = new MutationObserver(callback);
		for (let i = 0; i < nodesArr.length; i++) {
			observer.observe(nodesArr[i], config);
		}
		
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

function waitForElementToExist(elementQuery, callback) {
	onDomChange('html', (_, observer) => {
		if (document.querySelector(elementQuery)) {
			observer.disconnect();
			callback();
		}
	})
}

function waitForElementToNotExist(elementQuery, callback) {
	onDomChange(elementQuery, (_, observer) => {
		if (!document.querySelector(elementQuery)) {
			observer.disconnect();
			callback();
		}
	}) || callback();
}

function asyncWaitForElementToExist(elementQuery) {
	return new Promise((resolve) => {
		waitForElementToExist(elementQuery, resolve);
	})
}

function asyncWaitForElementToNotExist(elementQuery) {
	return new Promise((resolve) => {
		waitForElementToNotExist(elementQuery, resolve);
	})
}

function buildQuerySelector(...params) {
	let query = "";
	
	params.forEach(value => {
		if (Array.isArray(value))  {
			query += value.join();
		}
		
		if (typeof value === 'string') {
			query += value;
		}
	})
	
	return query;
}

function onElementCreation(elementQuery, onCreate, onRemove = null) {
	let disconnect = false;
	const handleDisconnect = () => {
		disconnect = true;
	}
	setTimeout(async () => {
		while (!disconnect) {
			await asyncWaitForElementToExist(elementQuery);
			if (disconnect) {
				return;
			}
			
			setTimeout(() => onCreate(handleDisconnect), 0)
			
			await asyncWaitForElementToNotExist(elementQuery);
			if (onRemove) {
				setTimeout(() => onRemove(handleDisconnect), 0)
			}
		}
	}, 0)
	
	return handleDisconnect;
}