[![Stories in Ready](https://badge.waffle.io/skeate/seque.png?label=ready&title=Ready)](https://waffle.io/skeate/seque)
[![Build Status](https://travis-ci.org/skeate/seque.svg?branch=master)](https://travis-ci.org/skeate/seque)
[![Test Coverage](https://codeclimate.com/github/skeate/seque/badges/coverage.svg)](https://codeclimate.com/github/skeate/seque/coverage)
[![Code Climate](https://codeclimate.com/github/skeate/seque/badges/gpa.svg)](https://codeclimate.com/github/skeate/seque)
[![npm version](https://badge.fury.io/js/seque.svg)](http://badge.fury.io/js/seque)
[![bower version](https://badge.fury.io/bo/seque.svg)](http://badge.fury.io/bo/seque)
[![Dev Status](https://david-dm.org/skeate/seque/dev-status.svg)](https://david-dm.org/skeate/seque#info=devDependencies&view=table)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/seque-tests.svg)](https://saucelabs.com/u/seque-tests)

# seque
chainable control flow methods for javascript

# what?

```javascript
let arr = [1, 2, 3, 4, 5, 6];
let useEvens = Math.random() > .5;
arr
  .if(useEvens)
  .filter(x => x % 2 == 0)
  .else()
  .filter(x => x % 2)
  .endif()
  // at this point we have either [2,4,6] or [1,3,5] depending on the value
  // of useEvens
```

see also: https://skeate.github.io/2015/07/17/Seque-What-It-Is-and-How-It-Works.html

# why?

why not

# the catch

unless your platform supports proxies (check compatibility with [kangax's
compat-table](https://kangax.github.io/compat-table/es6/#Proxy)) this won't work
completely seamlessly. if a link in a chain returns an object with a method not
on the link in the chain right before a seque method, *and* you then try to call
that method, things'll break, unless you deliberately specify that method's name
in the seque method call.
