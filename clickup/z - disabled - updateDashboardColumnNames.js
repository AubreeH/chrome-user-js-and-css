if (globalUserJsAndCssToggle) {
	const updateMap = {
		"Pull Request": "PR",
		"Custom Task ID": "",
		"Priority": "",
		"Time estimate": "",
		"Time tracked": "",
		"Task Name": "",
		"Lists": "",
		"Date done": "Done",
		"Date updated": "Update",
		"Tester": "",
	}
	
	function updateColumnNames() {
		consolelog("updateColumnNames");
		Object.entries(updateMap).forEach(([from, to]) => {
			const nodes = document.querySelectorAll(`[data-test="task-list-header-field__${from}"] .cu-task-list-header-field__title-text`)
			nodes.forEach(n => {
				if (n.textContent !== ` ${to} `) {
					n.textContent = ` ${to} `
				}
			})
		})
	}
	
	async function setupDashboardColumnEventListener() {
		let disconnectFunc = () => {}
		onElementCreation('cu-grid-dashboard', 
			() => {
				disconnectFunc = onDomChange('cu-grid-dashboard', updateColumnNames)
			},
			() => {
				disconnectFunc()
			}
		)
	}
	
	setupDashboardColumnEventListener()
}
