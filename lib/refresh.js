"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var _utils = require("./utils");

function refresh(ele) {
  var cof = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(0, _utils.isElement)(ele)) {
    // 不是dom元素
    throw new Error('m-pull-refresh need a dom element like div,not ' + typeof obj);
  }

  var config = (0, _assign.default)({
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

    (0, _utils.setTransition)(childDown, true);
    downHeight += (0, _utils.dampingDiff)(diff, config.maxDistance, downHeight);
    (0, _utils.setHeight)(childDown, downHeight);

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
      (0, _utils.setTransition)(childDown, false);
      startY = null;
      currentSt = 'release';
      config.statusChange('release');
      setTimeout(function () {
        // 获取 indicator高度
        (0, _utils.setHeight)(childDown, indicatorEle.clientHeight);
      }, 0);
      config.callback();
    } else if (currentSt === 'deactivate') {
      startY = null;
      (0, _utils.setTransition)(childDown, false);
      (0, _utils.setHeight)(childDown, 0);
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
    var _arr = (0, _keys.default)(eventList);

    for (var _i = 0; _i < _arr.length; _i++) {
      var key = _arr[_i];
      ele.addEventListener(key, eventList[key], _utils.willPreventDefault);
    }
  }

  if (isUp) {
    ele.addEventListener('scroll', scroll, _utils.notPreventDefault);
  }

  return {
    destory: function destory() {
      if (isDown) {
        var _arr2 = (0, _keys.default)(eventList);

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
        (0, _utils.setHeight)(childDown, 0);
      }
    }
  };
}

var _default = refresh;
exports.default = _default;