[![Build Status](https://travis-ci.org/skeate/seque.svg?branch=master)](https://travis-ci.org/skeate/seque)
[![Test Coverage](https://codeclimate.com/github/skeate/seque/badges/coverage.svg)](https://codeclimate.com/github/skeate/seque/coverage)
[![Code Climate](https://codeclimate.com/github/skeate/seque/badges/gpa.svg)](https://codeclimate.com/github/skeate/seque)

# seque
chainable utility methods for javascript

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

# why?

why not

# catches

unless your browser supports proxies (check compatibility with [kangax's compat-
table](https://kangax.github.io/compat-table/es6/#Proxy)) this won't work
completely seamlessly. if a link in a chain returns an object with a method not
on the link in the chain right before a seque method, *and* you then try to call
that method, things'll break, unless you deliberately specify that method's name
in the seque method call.
