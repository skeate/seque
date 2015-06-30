function wrap(obj, until, otherMethods, callback) {
  until = until || 1;
  var stopAfterCount = typeof(until) === 'number';
  if (!stopAfterCount) {
    otherMethods.push(until);
  }
  var proto = obj;
  obj = Object.create(proto);
  var callStack = [];
  var dummyMethod = function(methodName) {
    return function() {
      if (methodName !== until) {
        callStack.push([methodName, arguments]);
      }
      if (stopAfterCount && callStack.length >= until || methodName === until) {
        return callback(callStack);
      }
      return obj;
    };
  };
  var makeStub = function(method) {
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
  otherMethods.forEach(function(stubMethod) {
    obj[stubMethod] = dummyMethod(stubMethod);
  });
  return obj;
}

function applyStack(obj, callStack) {
  return callStack.reduce(function(obj, margs) {
    return obj[margs[0]].apply(obj, margs[1]);
  }, obj);
}

Object.prototype.if = function(cond) {
  return wrap(this, 'endif', ['else'], function(callStack) {
    for (var i = 0; i < callStack.length; i++) {
      if (callStack[i][0] === 'else') {
        break;
      }
    }
    var ifStack = callStack.slice(0, i);
    var elseStack = callStack.slice(i + 1, callStack.length);
    return applyStack(this, (cond) ? ifStack : elseStack);
  }.bind(this));
};

Object.prototype.while = function(condFunc) {
  return wrap(this, 'endwhile', [], function(callStack) {
    var ret = this;
    while (condFunc()) {
      applyStack(this, callStack);
    }
    return ret;
  }.bind(this));
};
