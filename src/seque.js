/**
 * seque v1.2.1
 * chainable utility methods for javascript
 *
 * by skeate
 * http://github.com/skeate/seque
 */

let Seque = (function() {
  let utils = {
    wrap(obj, until, otherMethods, callback) {
      let stopCount = typeof(until) === 'number';
      let callStack = [];
      if (typeof(Proxy) !== 'undefined') {
        obj = new Proxy(obj, {
          get(target, name) {
            if (stopCount && callStack.length >= until || name === until) {
              return () => callback(callStack);
            }
            return new Proxy(function() {}, {
              apply(target, thisArg, argList) {
                callStack.push([name, argList]);
                return obj;
              }
            });
          }
        });
      } else {
        if (!stopCount) {
          otherMethods.push(until);
        }
        let proto = obj;
        obj = Object.create(proto);
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
          if (proto[method] instanceof Function &&
              !obj.hasOwnProperty(method)) {
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
      }
      return obj;
    },

    applyStack(obj, callStack) {
      return callStack.reduce(
        (obj, margs) => obj[margs[0]].apply(obj, margs[1]),
        obj
      );
    }
  };

  // note: passing in context here rather than using .bind() because
  // phantomjs 1.9 doesn't have .bind(). >:(
  let handleIfElseStack = (context, cond) => function(callStack) {
    let i;
    for (i = 0; i < callStack.length; i++) {
      if (callStack[i][0] === 'else') {
        break;
      }
    }
    var ifStack = callStack.slice(0, i);
    var elseStack = callStack.slice(i + 1, callStack.length);
    return utils.applyStack(context, (cond) ? ifStack : elseStack);
  };

  Object.prototype.if = function(cond, extraMethods = []) {
    return utils.wrap(
      this,
      'endif',
      extraMethods.concat('else'),
      handleIfElseStack(this, cond)
    );
  };

  Object.prototype.ifAsync = function(condFunc) {
    return utils.wrap(this, 'endif', ['else'], callStack => {
      return this.then(x => handleIfElseStack(this, condFunc(x))(callStack));
    });
  };

  Object.prototype.while = function(condFunc, extraMethods = []) {
    var that = this;
    return utils.wrap(this, 'endwhile', extraMethods, callStack => {
      while (condFunc()) {
        that = utils.applyStack(that, callStack);
      }
      return that;
    });
  };

  Object.prototype.whileAsync = function(condFunc) {
    return utils.wrap(this, 'endwhile', [], (function loop(context) {
      return callStack => context.then(x => condFunc(x) ?
        loop(utils.applyStack(context, callStack))(callStack) : context
      );
    }(this)));
  };

  Object.prototype.loop = function(n, extraMethods = []) {
    var that = this;
    return utils.wrap(this, 'endloop', extraMethods, callStack => {
      while (n--) {
        that = utils.applyStack(that, callStack);
      }
      return that;
    });
  };

  return utils;
}());
