[![Stories in Ready](https://badge.waffle.io/skeate/seque.png?label=ready&title=Ready)](https://waffle.io/skeate/seque)
[![Build Status](https://travis-ci.org/skeate/seque.svg?branch=master)](https://travis-ci.org/skeate/seque)
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
