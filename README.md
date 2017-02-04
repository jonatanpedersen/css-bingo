# css-bingo
Removes unused rules from css by looking at used classes and ids in html.

[![Build Status](https://travis-ci.org/jonatanpedersen/css-bingo.svg?branch=master)](https://travis-ci.org/jonatanpedersen/css-bingo)
[![NPM Version](https://img.shields.io/npm/v/css-bingo.svg)](https://www.npmjs.com/package/css-bingo)
[![NSP Status](https://nodesecurity.io/orgs/jonatanpedersen/projects/efea09c6-afbc-4f30-ac78-f948c9b9928a/badge)](https://nodesecurity.io/orgs/jonatanpedersen/projects/efea09c6-afbc-4f30-ac78-f948c9b9928a)
[![Greenkeeper badge](https://badges.greenkeeper.io/jonatanpedersen/css-bingo.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/jonatanpedersen/css-bingo/badge.svg)](https://coveralls.io/github/jonatanpedersen/css-bingo)

## Install
``` bash
$ npm install css-bingo
```

## Usage

``` javascript
const cssBingo = require('css-bingo');

const css = '.foo{color:#fff;}.bar{color:#000;}#baz{color:777}';
const html = '<br class="foo" />';

console.log(cssBingo(css, html));
// .foo{color:#fff;}
```

## Selectors

### Supported
Rules with supported selectors will be removed when the selector is not found in the provided html.

| Selector | Example |
| --- | --- |
| [*](http://www.w3schools.com/cssref/sel_all.asp) | * |
| [.class](http://www.w3schools.com/cssref/sel_class.asp) | .foo |
| [.class.class](http://www.w3schools.com/cssref/sel_class.asp) | .foo.bar |
| [#id](http://www.w3schools.com/cssref/sel_id.asp) | #baz |
| [#id.class](http://www.w3schools.com/cssref/sel_id.asp) | #baz.foo |
| [element](http://www.w3schools.com/cssref/sel_element.asp) | p |
| [element.class](http://www.w3schools.com/cssref/sel_element.asp) | p.foo |
| [element,element](http://www.w3schools.com/cssref/sel_element_comma.asp) | div, p | 
| [element element](http://www.w3schools.com/cssref/sel_element_element.asp) | div p |
| [element>element](http://www.w3schools.com/cssref/sel_element_gt.asp) | div > p |
| [element+element](http://www.w3schools.com/cssref/sel_element_pluss.asp) | div + p |
| [element~element](http://www.w3schools.com/cssref/sel_gen_sibling.asp) | p ~ ul |

class names in both the class and the data-class attribute of html elements will be used.

``` html
<html>
    <body>
        <h1 class="foo" data-class="bar">Heading 1</h1>
    </body>
</html>
```

### Unsupported
Selector attributes, pseudo-classes and pseudo-elements are not supported.

| Selector | Example |
| --- | --- |
| [[attribute]](http://www.w3schools.com/cssref/sel_attribute.asp) | [target] |
| [[attribute=value]](http://www.w3schools.com/cssref/sel_attribute_value.asp) | [target=_blank] |
| [[attribute~=value]](http://www.w3schools.com/cssref/sel_attribute_value_contains.asp) | [title~=flower] |
| [[attribute\|=value]](http://www.w3schools.com/cssref/sel_attribute_value_lang.asp) | [lang|=en] |
| [[attribute^=value]](http://www.w3schools.com/cssref/sel_attr_begin.asp) | a[href^="https"] |
| [[attribute$=value]](http://www.w3schools.com/cssref/sel_attr_end.asp) | a[href$=".pdf"] |
| [[attribute*=value]](http://www.w3schools.com/cssref/sel_attr_contain.asp) | a[href*="w3schools"] |
| [:active](http://www.w3schools.com/cssref/sel_active.asp) | a:active |
| [::after](http://www.w3schools.com/cssref/sel_after.asp) | p::after |
| [::before](http://www.w3schools.com/cssref/sel_before.asp) | p::before |
| [:checked](http://www.w3schools.com/cssref/sel_checked.asp) | input:checked |
| [:disabled](http://www.w3schools.com/cssref/sel_disabled.asp) | input:disabled |
| [:empty](http://www.w3schools.com/cssref/sel_empty.asp) | p:empty |
| [:enabled](http://www.w3schools.com/cssref/sel_enabled.asp) | input:enabled |
| [:first-child](http://www.w3schools.com/cssref/sel_firstchild.asp) | p:first-child |
| [::first-letter](http://www.w3schools.com/cssref/sel_firstletter.asp) | p::first-letter |
| [::first-line](http://www.w3schools.com/cssref/sel_firstline.asp) | p::first-line |
| [:first-of-type](http://www.w3schools.com/cssref/sel_first-of-type.asp) | p:first-of-type |
| [:focus](http://www.w3schools.com/cssref/sel_focus.asp) | input:focus |
| [:hover](http://www.w3schools.com/cssref/sel_hover.asp) | a:hover |
| [:in-range](http://www.w3schools.com/cssref/sel_in-range.asp) | input:in-range |
| [:invalid](http://www.w3schools.com/cssref/sel_invalid.asp) | input:invalid |
| [:lang(language)](http://www.w3schools.com/cssref/sel_lang.asp) | p:lang(it) |
| [:last-child](http://www.w3schools.com/cssref/sel_last-child.asp) | p:last-child |
| [:last-of-type](http://www.w3schools.com/cssref/sel_last-of-type.asp) | p:last-of-type |
| [:link](http://www.w3schools.com/cssref/sel_link.asp) | a:link |
| [:not(selector)](http://www.w3schools.com/cssref/sel_not.asp) | :not(p) |
| [:nth-child(n)](http://www.w3schools.com/cssref/sel_nth-child.asp) | p:nth-child(2) |
| [:nth-last-child(n)](http://www.w3schools.com/cssref/sel_nth-last-child.asp) | p:nth-last-child(2) |
| [:nth-last-of-type(n)](http://www.w3schools.com/cssref/sel_nth-last-of-type.asp) | p:nth-last-of-type(2) |
| [:nth-of-type(n)](http://www.w3schools.com/cssref/sel_nth-of-type.asp) | p:nth-of-type(2) |
| [:only-of-type](http://www.w3schools.com/cssref/sel_only-of-type.asp) | p:only-of-type |
| [:only-child](http://www.w3schools.com/cssref/sel_only-child.asp) | p:only-child |
| [:optional](http://www.w3schools.com/cssref/sel_optional.asp) | input:optional |
| [:out-of-range](http://www.w3schools.com/cssref/sel_out-of-range.asp) | input:out-of-range |
| [:read-only](http://www.w3schools.com/cssref/sel_read-only.asp) | input:read-only |
| [:read-write](http://www.w3schools.com/cssref/sel_read-write.asp) | input:read-write |
| [:required](http://www.w3schools.com/cssref/sel_required.asp) | input:required |
| [:root](http://www.w3schools.com/cssref/sel_root.asp) | :root |
| [::selection](http://www.w3schools.com/cssref/sel_selection.asp) | ::selection |
| [:target](http://www.w3schools.com/cssref/sel_target.asp) | #news:target |
| [:valid](http://www.w3schools.com/cssref/sel_valid.asp) | input:valid |
| [:visited](http://www.w3schools.com/cssref/sel_visited.asp) | a:visited |

## Performance
1000 test runs on a 2.7 GHz Intel Core i5 MacBook Pro (early 2015) using unprocessed css and html from [debitoor](https://debitoor.com/).

| Library | Duration |
| --- | --- |
| css-bingo | 21s|
| [purify-css](https://github.com/purifycss/purifycss) | 149s|

## Licence
The MIT License (MIT)

Copyright (c) 2017 [Jonatan Pedersen](https://www.jonatanpedersen.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
