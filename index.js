var css = require('css');
var debug = require('debug')('css-bingo');
var htmlparser = require('htmlparser2');

module.exports = cssBingo;

function cssBingo (cssCode, htmlCode) {
	const classSelectors = new Set();
	const idSelectors = new Set();

	var parser = new htmlparser.Parser({
		onopentag: function(name, attribs){
			attribs.class && attribs.class.split(' ').map(className => `.${className}`).forEach(classSelector => classSelectors.add(classSelector));
			attribs.id && idSelectors.add(`#${attribs.id}`);
		}
	}, {decodeEntities: true});

	parser.write(htmlCode);
	parser.end();

	const ast = css.parse(cssCode);

	walk(ast.stylesheet);

	return css.stringify(ast, {compress:true});

	function walk (node) {
		node.rules = node.rules.reduce((rules, rule) => {
			switch (rule.type) {
				case 'rule':
					rule.selectors = rule.selectors.filter(selector => {
						if (/^\.[^\.:>\s]+$/.test(selector)) {
							return classSelectors.has(selector);
						} else if (/^\#[^\.:>\s]+$/.test(selector)) {
							return idSelectors.has(selector);
						} else {
							return true;
						}
					});

					if (rule.selectors.length > 0) {
						rules.push(rule);
					} else {
						debug('removed rule: %o', rule);
					}
					break;
				case 'media':
					walk(rule);
					if (rule.rules.length > 0) {
						rules.push(rule);
					}
					break;
				default:
					rules.push(rule);
					break;
			}

			return rules;
		}, []);
	}
}
