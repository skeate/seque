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
 * seque v1.0.0
 * chainable utility methods for javascript
 *
 * by skeate
 * http://github.com/skeate/seque
 */

'use strict';

var Seque = (function () {
  var utils = {
    wrap: function wrap(obj) {
      var until = arguments[1] === undefined ? 1 : arguments[1];
      var otherMethods = arguments[2] === undefined ? [] : arguments[2];
      var callback = arguments[3] === undefined ? function (x) {
        return x;
      } : arguments[3];

      var stopCount = typeof until === 'number';
      if (!stopCount) {
        otherMethods.push(until);
      }
      var proto = obj;
      obj = Object.create(proto);
      var callStack = [];
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
      return obj;
    },

    applyStack: function applyStack(obj, callStack) {
      return callStack.reduce(function (obj, margs) {
        return obj[margs[0]].apply(obj, margs[1]);
      }, obj);
    }
  };

  Object.prototype['if'] = function (cond) {
    var _this = this;

    return utils.wrap(this, 'endif', ['else'], function (callStack) {
      var i = undefined;
      for (i = 0; i < callStack.length; i++) {
        if (callStack[i][0] === 'else') {
          break;
        }
      }
      var ifStack = callStack.slice(0, i);
      var elseStack = callStack.slice(i + 1, callStack.length);
      return utils.applyStack(_this, cond ? ifStack : elseStack);
    });
  };

  Object.prototype['while'] = function (condFunc) {
    var that = this;
    return utils.wrap(this, 'endwhile', [], function (callStack) {
      while (condFunc()) {
        that = utils.applyStack(that, callStack);
      }
      return that;
    });
  };

  Object.prototype.loop = function (n) {
    var that = this;
    return utils.wrap(this, 'endloop', [], function (callStack) {
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
