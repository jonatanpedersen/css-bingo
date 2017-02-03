const css = require('css');
const htmlparser = require('htmlparser2');
const CssSelectorParser = require('css-selector-parser').CssSelectorParser;

module.exports = cssBingo;

function cssBingo (cssCode, htmlCode) {
	const cssAst = css.parse(cssCode);
	const selectors = getSelectorsFromCssAst(cssAst);
	const usedSelectors = filterSelectorsNotUsedInHtmlCode (selectors, htmlCode);
	const newCssAst = filterSelectorsFromCssAst(cssAst, usedSelectors);

	return css.stringify(newCssAst, {compress:true});
}

function getSelectorsFromCssAst(cssAst) {
	const selectors = new Set();

	walk(cssAst.stylesheet);

	return selectors;

	function walk (node) {
		node.rules && node.rules.forEach(rule => {
			if (rule.type === 'rule') {
				rule.selectors && rule.selectors.forEach(selector => selectors.add(selector));
			} else if (rule.rules) {
				walk(rule);
			}
		});
	}
}

function filterSelectorsNotUsedInHtmlCode (selectors, htmlCode) {
	const cssSelectorParser = new CssSelectorParser();
	cssSelectorParser.registerSelectorPseudos('has');
	cssSelectorParser.registerNestingOperators(' ', '>', '+', '~');
	cssSelectorParser.registerAttrEqualityMods('^', '$', '*', '~');
	cssSelectorParser.enableSubstitutes();
	
	const selectorRuleMap = {};

	selectors.forEach((selector) => {
		selectorRuleMap[selector] = cssSelectorParser.parse(selector).rule;
	});

	const unknownSelectors = new Set([...selectors]);
	const knownSelectors = new Set();

	selectors.forEach(selector => {
		const rule = selectorRuleMap[selector];

		if (rule.nestingOperator || rule.rule && rule.rule.nestingOperator !== undefined) {
			unknownSelectors.delete(selector);
			knownSelectors.add(selector);

			return;
		}
	});

	let levelIdx = -1;
	let levels = [];

	const parser = new htmlparser.Parser({
		onopentag: (name, attrs) => {
			levelIdx++;

			const levelSelectorRules = levels[levelIdx] = levels[levelIdx] || new Set();
			const nextLevelSelectorRules = levels[levelIdx + 1] = levels[levelIdx + 1] || new Set();

			const element = {
				name: name,
				id: attrs.id,
				attrs: attrs,
				classNames: new Set([attrs['class'], attrs['data-class']].filter(Boolean).join(' ').split(' ').filter(Boolean).sort())
			};

			unknownSelectors.forEach(selector => {
				const rule = selectorRuleMap[selector];

				levelSelectorRules.add({
					rule: rule,
					selector: selector
				});
			});

			levelSelectorRules.forEach(levelSelectorRule => {
				const selector = levelSelectorRule.selector;
				const rule = levelSelectorRule.rule;

				if (!unknownSelectors.has(levelSelectorRule.selector)) {
					return;
				}

				const isMatch = match(element, rule);

				if (isMatch) {
					if (rule.rule) {
						nextLevelSelectorRules.add({
							rule: rule.rule,
							selector: selector
						});
					} else {
						knownSelectors.add(selector);
						unknownSelectors.delete(selector);
					}
				}
			});

			function match (element, rule) {
				return (!rule.id || (rule.id === element.id)) && (!rule.tagName || (rule.tagName === '*' || rule.tagName === element.name)) && (!rule.classNames || (rule.classNames.filter(ruleClassName => element.classNames.has(ruleClassName)).length === rule.classNames.length));
			}
		},
		onclosetag: () => {
			delete levels[levelIdx];
			levelIdx--;
		}
	});

	parser.write(htmlCode);
	parser.end();

	return knownSelectors;
}

function filterSelectorsFromCssAst (cssAst, selectorSet) {
	const cssAstClone = clone(cssAst);
	walk(cssAstClone.stylesheet);

	return cssAstClone;

	function walk (node) {
		node.rules = node.rules.reduce((rules, rule) => {
			if (rule.type === 'rule') {
				rule.selectors = rule.selectors.filter(selector => selectorSet.has(selector));

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

function clone (obj) {
	return JSON.parse(JSON.stringify(obj));
}
