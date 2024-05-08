// Depends on:
// globalToggle
// domManagement

const dateTimeSelectors = [
	{
		query: '[data-test="time-tracking-display__time-tracked"] > .cu-task-info__value',
		from: '%H%:%m%:%s%',
		to: '(?H:%H%h)', // (?m:%m%m)
	}
];

function handleDomChangeShrinkDateTimes() {
	dateTimeSelectors.forEach((opt) => {
		const nodes = document.querySelectorAll(opt.query);
		nodes.forEach((node) => handleDateNodeUpdate(opt, node))
	})
}

function handleDateNodeUpdate(opt, node) {
	const currentValue = node.innerText;
	const originalAttr = node.getAttribute('data-date-original');
	const transformedAttr = node.getAttribute('data-date-transformed');
	
	if (transformedAttr && currentValue === originalAttr) {
		return;
	}
	
	node.setAttribute('data-date-original', currentValue)
	node.setAttribute('data-date-transformed', transformDate(opt, currentValue))
}

function transformDate(opt, val) {
	const matchResult = val.match(opt.regex);
	const groups = matchResult?.groups;
	if (!groups) {
		return 'false';
	}
	
	let output = opt.to;
	
	if (opt.outputOptionalLogic) {
		Object.entries(opt.outputOptionalLogic).forEach(([key, val]) => {
			if (!val?.name || !groups[val.name]) {
				output = output.replace(key, '');
				return;
			}
			
			output = output.replace(key, val.value)
		})
	}
	
	if (opt.outputReplacers) {
		opt.outputReplacers.forEach((replacer) => {
			output = output.replace(`%${replacer}%`, groups[replacer] ?? '');
		})
	}
	
	return output.trim();
}

const fromRegexShorthand = {
	"%Y%": '(?<Y>\\d+)',
	"%M%": '(?<M>\\d+)',
	"%MM%": '(?<M>\\S+)',
	"%D%": '(?<D>\\d+)',
	"%H%": '(?<H>\\d+)',
	"%m%": '(?<m>\\d+)',
	"%s%": '(?<s>\\d+)',
	"%ms%": '(?<ms>\\d+)',
	"%Y?%": '(?<Y>\\d+)',
	"%M?%": '(?<M>\\d+)',
	"%D?%": '(?<D>\\d+)',
	"%H?%": '(?<H>\\d+)',
	"%m?%": '(?<m>\\d+)',
	"%s?%": '(?<s>\\d+)',
	"%ms?%": '(?<ms>\\d+)',
};

function setupRegex(opt) {
	let from = opt.from;
	let to = opt.to;
	
	Object.entries(fromRegexShorthand).forEach(([key, val]) => {
		from = from.replace(key, val);
	})
	opt.regex = new RegExp(from);
	
	const toOptionalLogicMatch = to.matchAll(/\(\?(?<name>.*?):(?<value>.+?)(?<=[^\\])\)/g);
	toOptionalLogicMatch.forEach((match) => {
		if (!opt.outputOptionalLogic) {
			opt.outputOptionalLogic = {};
		}
		
		opt.outputOptionalLogic[match[0]] = match.groups;
	})
	
	const toReplacersMatch = to.matchAll(/%(.*?)%/g)
	toReplacersMatch.forEach((match) => {
		if (!opt.outputReplacers) {
			opt.outputReplacers = [];
		}
		
		if (!opt.outputReplacers.includes(match[1])) {
			opt.outputReplacers.push(match[1])
		}
	})
}

function handleSetupShrinkDateTimes() {
	dateTimeSelectors.forEach(opt => {
		setupRegex(opt);
	})
}

handleSetupShrinkDateTimes();
setInterval(handleDomChangeShrinkDateTimes, 250);