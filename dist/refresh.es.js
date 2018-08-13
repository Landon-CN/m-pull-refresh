'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/**
 * 判断一个对象是不是dom对象
 * @param {} obj
 */
function isElement(obj) {
  return obj && _typeof(obj) === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}
function setHeight(ele, y) {
  y = y > 0 ? y : 0;
  ele.style.minHeight = "".concat(y, "px");
}
/**
 * 设置/删除tansition动画
 * @param {*} ele
 * @param {*} del
 */

function setTransition(ele, del) {
  if (del) {
    ele.style.transition = '';
    ele.style.webkitTransition = '';
  } else {
    ele.style.transition = 'min-height .3s';
    ele.style.webkitTransition = 'min-height .3s';
  }
}
/**
 * 设置缓动，最大距离不会超过maxDistance
 */

function dampingDiff(diff, max, height) {
  if (height >= max && diff >= 0) {
    return 0;
  } else {
    var rate = Math.abs(diff) / window.screen.height;
    return diff * (1 - rate);
  }
} // 判断是否支持 passive 属性

var supportsPassive = false;

try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) {}

var willPreventDefault = supportsPassive ? {
  passive: false
} : false;
var notPreventDefault = supportsPassive ? {
  passive: true
} : false;

function refresh(ele) {
  var cof = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!isElement(ele)) {
    // 不是dom元素
    throw new Error('m-pull-refresh need a dom element like div,not ' + (typeof obj === "undefined" ? "undefined" : _typeof(obj)));
  }

  var config = _extends({
    maxDistance: 200,
    refreshDistance: 40,
    statusChange: function statusChange() {},
    callback: function callback() {},
    direction: 'up'
  }, cof);

  var currentSt = '';
  var childDown = ele.querySelector(".godz-pr-down");
  var childUp = ele.querySelector(".godz-pr-up");
  var indicatorEle = ele.querySelector('.godz-pr-text');
  var isUp = config.direction === 'both' || config.direction === 'up';
  var isDown = config.direction === 'both' || config.direction === 'down';
  var startY = null;

  function touchstart(event) {
    startY = event.touches[0].screenY;
  }

  var downHeight = 0;
  var moving = false;

  function touchmove(event) {
    var screenY = event.touches[0].screenY; // 直接阻止默认事件，防止警告

    if (moving) event.preventDefault();

    if (!moving && startY > screenY && isDown) {
      return;
    }

    if (currentSt === 'release') {
      // 正在加载的时候，阻止默认事件，并返回
      return event.preventDefault();
    }

    if (ele.scrollTop > 0) {
      return;
    }

    moving = true;
    event.preventDefault();
    var diff = Math.round(screenY - startY);
    startY = screenY; // 设置过度效果

    setTransition(childDown, true);
    downHeight += dampingDiff(diff, config.maxDistance, downHeight);
    setHeight(childDown, downHeight);

    if (downHeight < config.refreshDistance) {
      if (currentSt !== 'deactivate') {
        currentSt = 'deactivate';
        config.statusChange('deactivate');
      }
    } else {
      if (currentSt !== 'activate') {
        currentSt = 'activate';
        config.statusChange('activate');
      }
    }
  }

  function touchend() {
    if (currentSt === 'activate') {
      downLoading = true;
      setTransition(childDown, false);
      startY = null;
      currentSt = 'release';
      config.statusChange('release');
      setTimeout(function () {
        // 获取 indicator高度
        setHeight(childDown, indicatorEle.clientHeight);
      }, 0);
      config.callback();
    } else if (currentSt === 'deactivate') {
      startY = null;
      setTransition(childDown, false);
      setHeight(childDown, 0);
    }

    downHeight = 0;
    moving = false;
  }

  var upLoading = false;
  var startTop = null;
  /**
   * 监听滚动事件，判断到底触发刷新
   */

  function scroll() {
    if (startTop === null) {
      startTop = ele.scrollTop;
      return;
    } // 必须是向下滚动才行，方向不能错


    if (startTop >= ele.scrollTop) {
      return;
    }

    var bottomDistance = ele.scrollHeight - ele.scrollTop - ele.clientHeight;

    if (upLoading || bottomDistance > 100) {
      // 加载中，或者没到到触发距离
      return;
    }

    upLoading = true;
    childUp.style.visibility = 'visible';
    config.callback();
  }

  var eventList = {
    touchstart: touchstart,
    touchmove: touchmove,
    touchend: touchend
  };

  if (isDown) {
    var _arr = Object.keys(eventList);

    for (var _i = 0; _i < _arr.length; _i++) {
      var key = _arr[_i];
      ele.addEventListener(key, eventList[key], willPreventDefault);
    }
  }

  if (isUp) {
    ele.addEventListener('scroll', scroll, notPreventDefault);
  }

  return {
    destory: function destory() {
      if (isDown) {
        var _arr2 = Object.keys(eventList);

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var _key = _arr2[_i2];
          ele.removeEventListener(_key, eventList[_key]);
        }
      }

      if (isUp) {
        ele.removeEventListener('scroll', scroll);
      }
    },
    endSuccess: function endSuccess() {
      // 加载结束回调，隐藏loading状态
      if (isUp) {
        childUp.style.visibility = 'hidden';
        upLoading = false;
        startTop = null;
      }

      if (isDown) {
        currentSt = 'finish';
        config.statusChange('finish');
        setHeight(childDown, 0);
      }
    }
  };
}

module.exports = refresh;
