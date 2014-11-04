'use strict';

var toString = Object.prototype.toString;

var DOUBLE_BRACKET = /({{|}})/;
var PLACEHOLDER = /{([^}]*)}/g;

function isString(value) {
  return (toString.call(value) === '[object String]');
}

function isObject(value) {
  return (value && toString.call(value) === '[object Object]');
}

/* istanbul ignore next */
var isArray = Array.isArray || function isArray(value) {
  return toString.call(value) === '[object Array]';
};

function get(obj, path) {
  var keys = path.split('.');

  for (var i = 0, len = keys.length; i < len; ++i) {
    var key = keys[i];

    if (!isObject(obj) || !(key in obj)) {
      return '';
    }

    obj = obj[key];
  }

  return obj;
}

function set(obj, path, value) {
  var keys = path.split('.');

  for (var i = 0, len = keys.length; i < len; ++i) {
    var key = keys[i];

    if (!isObject(obj)) {
      return;
    }

    if (i === len - 1) {
      return (obj[key] = value);
    }

    if (!(key in obj)) {
      return;
    }

    obj = obj[key];
  }
}

var visited;

function resolve(value, obj) {
  if (!isString(value)) {
    return value;
  }

  var parts = value.split(DOUBLE_BRACKET);

  parts = parts.map(function (part) {
    return part.replace(PLACEHOLDER, function (_, path) {
      if (path in visited) {
        return '';
      }

      visited[path] = 1;

      var r = '' + resolve(get(obj, path), obj);
      set(obj, path, r);

      return r;
    });
  });

  return parts.join('');
}

function resolveFirst(value, obj) {
  visited = {};
  return resolve(value, obj);
}

function expand(obj, root) {
  for (var key in obj) {
    /* istanbul ignore next */
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    var value = obj[key];

    if (isString(value)) {
      obj[key] = resolveFirst(value, root);
    }
    else if (isArray(value)) {
      obj[key] = value.map(function (item) {
        return resolveFirst(item, root);
      }); /* jshint ignore: line */
    }
    else /* istanbul ignore else */ if (isObject(value)) {
      expand(value, root);
    }
  }

  return obj;
}

module.exports = function expandFirst(obj) {
  return expand(obj, obj);
};
