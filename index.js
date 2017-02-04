const css = require('css');
const htmlparser = require('htmlparser2');
const CssSelectorParser = require('css-selector-parser').CssSelectorParser;

module.exports = cssBingo;

function cssBingo (cssCode, htmlCode) {
	const cssAst = css.parse(cssCode);
	const selectorRules = getSelectorRulesFromCssAst(cssAst);
	const matchedSelectors = filterSelectorsNotUsedInHtmlCode (selectorRules, htmlCode);
	const newCssAst = filterSelectorsFromCssAst(cssAst, matchedSelectors);

	return css.stringify(newCssAst, {compress:true});
}

function getSelectorRulesFromCssAst(cssAst) {
	const cssSelectorParser = new CssSelectorParser();
	cssSelectorParser.registerSelectorPseudos('has');
	cssSelectorParser.registerNestingOperators('>', '+', '~');
	cssSelectorParser.registerAttrEqualityMods('^', '$', '*', '~');
	cssSelectorParser.enableSubstitutes();
	
	const selectorRules = [];

	walk(cssAst.stylesheet);

	return selectorRules;

	function walk (node) {
		if (!node.rules) {
			return;
		}

		for (var j = 0; j < node.rules.length; j++) {
			const rule = node.rules[j];

			if (rule.type === 'rule' && rule.selectors) {
				for (var i = 0; i < rule.selectors.length; i++) {
					const selector = rule.selectors[i];
					const ruleAst = cssSelectorParser.parse(selector).rule;
					const matched = ruleAst.nestingOperator !== undefined || ruleAst.rule && ruleAst.rule.nestingOperator !== undefined;

					selectorRules.push({
						selector: selector,
						rule: ruleAst,
						matched: matched
					});
				}
			} else if (rule.type === 'media') {
				walk(rule);
			}
		}
	}
}

function filterSelectorsNotUsedInHtmlCode (selectorRules, htmlCode) {
	let levelIdx = -1;
	let levels = [];

	const matchedSelectors = new Set();

	for (var x = 0; x < selectorRules.length; x++) {
		if (selectorRules[x].matched === true) {
			matchedSelectors.add(selectorRules[x].selector);
		}
	}

	const parser = new htmlparser.Parser({
		onopentag: (name, attrs) => {
			levelIdx++;

			const levelSelectorRules = levels[levelIdx] = levels[levelIdx] || [];
			const nextLevelSelectorRules = levels[levelIdx + 1] = levels[levelIdx + 1] || [];

			const element = {
				name: name,
				id: attrs.id,
				attrs: attrs,
				classNames: new Set([attrs['class'], attrs['data-class']].join(' ').split(' ').filter(Boolean))
			};

			for (var i = 0; i < selectorRules.length; i++) {
				const selectorRule = selectorRules[i];
				
				if (!matchedSelectors.has(selectorRule.selector)) {
					levelSelectorRules.push({
						rule: selectorRule.rule,
						selector: selectorRule.selector
					});
				}
			}

			for (var j = 0; j < levelSelectorRules.length; j++) {
				const levelSelectorRule = levelSelectorRules[j];
			
				levelSelectorRule.matched = match(element, levelSelectorRule.rule);

				if (levelSelectorRule.matched) {
					if (levelSelectorRule.rule.rule) {
						nextLevelSelectorRules.push({
							rule: levelSelectorRule.rule.rule,
							selector: levelSelectorRule.selector
						});
					} else {
						matchedSelectors.add(levelSelectorRule.selector);
					}
				}
			}

			function match (element, rule) {
				const id = (!rule.id || (rule.id === element.id));
				const name = (!rule.tagName || (rule.tagName === '*' || rule.tagName === element.name));
				const classNames = (!rule.classNames || (rule.classNames.filter(ruleClassName => element.classNames.has(ruleClassName)).length === rule.classNames.length));

				return id && name && classNames;
			}
		},
		onclosetag: () => {
			delete levels[levelIdx];
			delete levels[levelIdx + 1];
			levelIdx--;
		}
	});
	
	parser.write(htmlCode);
	parser.end();

	return matchedSelectors;
}

function filterSelectorsFromCssAst (cssAst, selectors) {
	walk(cssAst.stylesheet);

	return cssAst;

	function walk (node) {
		node.rules = node.rules.reduce((rules, rule) => {
			if (rule.type === 'rule') {
				rule.selectors = rule.selectors.filter(selector => selectors.has(selector));

				if (rule.selectors.length > 0) {
					rules.push(rule);
				}
			} else if (rule.type === 'media') {
				walk(rule);
				if (rule.rules.length > 0) {
					rules.push(rule);
				}
			} else {
				rules.push(rule);
			}

			return rules;
		}, []);
	}
}