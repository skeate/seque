/**
 * seque v1.0.0
 * chainable utility methods for javascript
 *
 * by skeate
 * http://github.com/skeate/seque
 */

let Seque = (function() {
  let utils = {
    wrap(obj, until = 1, otherMethods = [], callback = x => x) {
      let stopCount = typeof(until) === 'number';
      if (!stopCount) {
        otherMethods.push(until);
      }
      let proto = obj;
      obj = Object.create(proto);
      let callStack = [];
      let dummyMethod = methodName => function() {
        if (methodName !== until) {
          callStack.push([methodName, arguments]);
        }
        if (stopCount && callStack.length >= until || methodName === until) {
          return callback(callStack);
        }
        return obj;
      };
      let makeStub = method => {
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
      otherMethods.forEach(stubMethod => {
        obj[stubMethod] = dummyMethod(stubMethod);
      });
      return obj;
    },

    applyStack(obj, callStack) {
      return callStack.reduce(
        (obj, margs) => obj[margs[0]].apply(obj, margs[1]),
        obj
      );
    }
  };

  Object.prototype.if = function(cond) {
    return utils.wrap(this, 'endif', ['else'], callStack => {
      let i;
      for (i = 0; i < callStack.length; i++) {
        if (callStack[i][0] === 'else') {
          break;
        }
      }
      var ifStack = callStack.slice(0, i);
      var elseStack = callStack.slice(i + 1, callStack.length);
      return utils.applyStack(this, (cond) ? ifStack : elseStack);
    });
  };

  Object.prototype.while = function(condFunc) {
    var that = this;
    return utils.wrap(this, 'endwhile', [], callStack => {
      while (condFunc()) {
        that = utils.applyStack(that, callStack);
      }
      return that;
    });
  };

  Object.prototype.loop = function(n) {
    var that = this;
    return utils.wrap(this, 'endloop', [], callStack => {
      while (n--) {
        that = utils.applyStack(that, callStack);
      }
      return that;
    });
  };

  return utils;
}());
