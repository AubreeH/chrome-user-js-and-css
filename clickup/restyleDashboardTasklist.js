setInterval(function() {
	const nodes = document.querySelectorAll('cu-task-list')
	nodes.forEach((node) => {
		const headerItemsContainer = node.querySelector('.cu-task-list-header__items')
		if (!headerItemsContainer) {
			return;
		}
		
		node.style.setProperty('--columns', headerItemsContainer.children.length + 1);
	})
}, 250);