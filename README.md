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
