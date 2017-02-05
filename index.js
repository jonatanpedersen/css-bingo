'use strict';
const css = require('css');
const CssSelectorParser = require('css-selector-parser').CssSelectorParser;
const debug = require('debug')('css-bingo');
const htmlparser = require('htmlparser2');
const quoted = require('quoted');

module.exports = cssBingo;

function cssBingo(cssCode, htmlCode) {
	const cssAst = css.parse(cssCode);
	const selectorRules = getSelectorRulesFromCssAst(cssAst);
	const unmatchedSelectors = matchSelectorsInHtml(selectorRules, htmlCode);
	removeUnmatchedSelectorsAndRulesFromCssAst(cssAst, unmatchedSelectors);

	return css.stringify(cssAst, { compress: true });
}

function getSelectorRulesFromCssAst(cssAst) {
	const cssSelectorParser = new CssSelectorParser();
	cssSelectorParser.registerSelectorPseudos('has');
	cssSelectorParser.registerNestingOperators('>', '+', '~');
	cssSelectorParser.registerAttrEqualityMods('^', '$', '*', '~');

	const selectorRules = [];

	walk(cssAst.stylesheet);

	return selectorRules;

	function walk(node) {
		for (var j = 0; j < node.rules.length; j++) {
			const rule = node.rules[j];
		
			if (rule.type === 'rule') {
				for (var i = 0; i < rule.selectors.length; i++) {
					const selector = rule.selectors[i];

					selectorRules.push({
						selector: selector,
						rule: cssSelectorParser.parse(selector).rule
					});
				}
			} else if (rule.type === 'media') {
				walk(rule);
			}
		}
	}
}

function matchSelectorsInHtml(selectorRules, htmlCode) {
	var levelIdx = -1;
	var levels = [];

	const matchedSelectors = new Set();
	const unmatchedSelectors = new Set();
	const unmatchedSelectorRules = [];

	for (var x = 0; x < selectorRules.length; x++) {
		const selectorRule = selectorRules[x];

		unmatchedSelectors.add(selectorRule.selector);
		unmatchedSelectorRules.push(selectorRule);
	}

	var element;

	const parser = new htmlparser.Parser({
		onopentag: (name, attrs) => {
			levelIdx++;

			element = {
				name: name,
				id: attrs.id,
				attrs: attrs,
				classNames: new Set([attrs['class'], attrs['data-class']].join(' ').split(' ').filter(Boolean))
			};

			const levelSelectorRules = levels[levelIdx] = levels[levelIdx] || [];
			const nextLevelSelectorRules = levels[levelIdx + 1] = levels[levelIdx + 1] || [];

			// The unmatached and level selector rules arrays can be mutated by selector rule processing.
			// Create a tmp array to hold all the unmatched and the selector rules to avoid iterating mutating arrays.
			// new Array() and array[] is used as it is faster than array.push() and Array.concat()
			const tmpSelectorRules = new Array(unmatchedSelectorRules.length + levelSelectorRules.length);

			for (var i = 0; i < unmatchedSelectorRules.length; i++) {
				tmpSelectorRules[i] = unmatchedSelectorRules[i];
			}

			for (var j = 0; j < levelSelectorRules.length; j++) {
				tmpSelectorRules[i + j] = levelSelectorRules[j];
			}
			
			// Process all selector rules
			for (var k = 0; k < tmpSelectorRules.length; k++) {
				processSelectorRules(tmpSelectorRules[k]);
			}

			function processSelectorRules(levelSelectorRule) {
				const matches = match(element, levelSelectorRule.rule);
				
				if (matches) {
					// If there is a match then we check whether the rule has any child rules,
					// If it does we send the child rule to the next level,
					// otherwise it means that the whole selector has been matched can remove it
					// from the unmatched selectors set and add it matched selectors set.
					if (levelSelectorRule.rule.rule) {
						const nestingOperator = levelSelectorRule.rule.rule.nestingOperator;
						const newLevelSelectorRule = {
							rule: levelSelectorRule.rule.rule,
							selector: levelSelectorRule.selector
						};

						if (nestingOperator === null || nestingOperator === '>') {
							nextLevelSelectorRules.push(newLevelSelectorRule);
						} else {
							levelSelectorRules.push(newLevelSelectorRule);
						}
					} else {
						for (var y = 0; y < unmatchedSelectorRules.length; y++) {
							if (unmatchedSelectorRules[y].selector === levelSelectorRule.selector) {
								unmatchedSelectorRules.splice(y, 1);
								matchedSelectors.add(levelSelectorRule.selector);
								unmatchedSelectors.delete(levelSelectorRule.selector);
								break;
							}
						}
					}
				} else {
					// If we don't have a match then check the nesting operator.
					// If the nesting operator is null i.e. .class .class then we
					// can push the levelSelectorRule to the next level.
					if (levelSelectorRule.rule.nestingOperator === null) {
						nextLevelSelectorRules.push(levelSelectorRule);
					}
				}
			}

			function match(element, rule) {
				const id = (!rule.id || (rule.id === element.id));
				const name = (!rule.tagName || rule.tagName === element.name || rule.tagName === '*');
				const classNames = (!rule.classNames || (rule.classNames.filter(ruleClassName => element.classNames.has(ruleClassName)).length === rule.classNames.length));

				return id && name && classNames;
			}
		},
		onclosetag: () => {
			delete levels[levelIdx + 1];
			levelIdx--;
		},
		ontext: text => {
			if (element.name === 'script') {
				const texts = new Set(quoted(text));

				for (var x = 0; x < selectorRules.length; x++) {
					const selectorRule = selectorRules[x];

					if (texts.has(selectorRule.selector)) {
						matchedSelectors.add(selectorRule.selector);
						unmatchedSelectors.delete(selectorRule.selector);
					}
				}
			}
		}
	});

	parser.write(htmlCode);
	parser.end();

	return unmatchedSelectors;
}

function removeUnmatchedSelectorsAndRulesFromCssAst(cssAst, unmatchedSelectors) {
	walk(cssAst.stylesheet);

	function walk(node) {
		const newRules = [];

		for (var i = 0; i < node.rules.length; i++) {
			const rule = node.rules[i];
			if (rule.type === 'rule') {
				rule.selectors = rule.selectors.filter(selector => !unmatchedSelectors.has(selector));

				if (rule.selectors.length > 0) {
					newRules.push(rule);
				} else {
					debug('removed rule: %o', rule);
				}
			} else if (rule.type === 'media') {
				walk(rule);
				if (rule.rules.length > 0) {
					newRules.push(rule);
				}
			} else {
				newRules.push(rule);
			}
		}

		node.rules = newRules;
	}
}