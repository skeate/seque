;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Seque = factory();
  }
}(this, function() {
/**
 * seque v1.2.1
 * chainable utility methods for javascript
 *
 * by skeate
 * http://github.com/skeate/seque
 */

'use strict';

var Seque = (function () {
  var utils = {
    wrap: function wrap(obj, until, otherMethods, callback) {
      var stopCount = typeof until === 'number';
      var callStack = [];
      if (typeof Proxy !== 'undefined') {
        obj = new Proxy(obj, {
          get: function get(target, name) {
            if (stopCount && callStack.length >= until || name === until) {
              return function () {
                return callback(callStack);
              };
            }
            return new Proxy(function () {}, {
              apply: function apply(target, thisArg, argList) {
                callStack.push([name, argList]);
                return obj;
              }
            });
          }
        });
      } else {
        (function () {
          if (!stopCount) {
            otherMethods.push(until);
          }
          var proto = obj;
          obj = Object.create(proto);
          var dummyMethod = function dummyMethod(methodName) {
            return function () {
              if (methodName !== until) {
                callStack.push([methodName, arguments]);
              }
              if (stopCount && callStack.length >= until || methodName === until) {
                return callback(callStack);
              }
              return obj;
            };
          };
          var makeStub = function makeStub(method) {
            if (proto[method] instanceof Function && !obj.hasOwnProperty(method)) {
              if (method === 'hasOwnProperty') {
                return;
              }
              obj[method] = dummyMethod(method);
            }
          };
          while (proto) {
            Object.getOwnPropertyNames(proto).forEach(makeStub);
            proto = Object.getPrototypeOf(proto);
          }
          otherMethods.forEach(function (stubMethod) {
            obj[stubMethod] = dummyMethod(stubMethod);
          });
        })();
      }
      return obj;
    },

    applyStack: function applyStack(obj, callStack) {
      return callStack.reduce(function (obj, margs) {
        return obj[margs[0]].apply(obj, margs[1]);
      }, obj);
    }
  };

  // note: passing in context here rather than using .bind() because
  // phantomjs 1.9 doesn't have .bind(). >:(
  var handleIfElseStack = function handleIfElseStack(context, cond) {
    return function (callStack) {
      var i = undefined;
      for (i = 0; i < callStack.length; i++) {
        if (callStack[i][0] === 'else') {
          break;
        }
      }
      var ifStack = callStack.slice(0, i);
      var elseStack = callStack.slice(i + 1, callStack.length);
      return utils.applyStack(context, cond ? ifStack : elseStack);
    };
  };

  Object.prototype['if'] = function (cond) {
    var extraMethods = arguments[1] === undefined ? [] : arguments[1];

    return utils.wrap(this, 'endif', extraMethods.concat('else'), handleIfElseStack(this, cond));
  };

  Object.prototype.ifAsync = function (condFunc) {
    var _this = this;

    return utils.wrap(this, 'endif', ['else'], function (callStack) {
      return _this.then(function (x) {
        return handleIfElseStack(_this, condFunc(x))(callStack);
      });
    });
  };

  Object.prototype['while'] = function (condFunc) {
    var extraMethods = arguments[1] === undefined ? [] : arguments[1];

    var that = this;
    return utils.wrap(this, 'endwhile', extraMethods, function (callStack) {
      while (condFunc()) {
        that = utils.applyStack(that, callStack);
      }
      return that;
    });
  };

  Object.prototype.whileAsync = function (condFunc) {
    return utils.wrap(this, 'endwhile', [], (function loop(context) {
      return function (callStack) {
        return context.then(function (x) {
          return condFunc(x) ? loop(utils.applyStack(context, callStack))(callStack) : context;
        });
      };
    })(this));
  };

  Object.prototype.loop = function (n) {
    var extraMethods = arguments[1] === undefined ? [] : arguments[1];

    var that = this;
    return utils.wrap(this, 'endloop', extraMethods, function (callStack) {
      while (n--) {
        that = utils.applyStack(that, callStack);
      }
      return that;
    });
  };

  return utils;
})();
return Seque;
}));
