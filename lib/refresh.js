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

  cof.loadFull = (0, _assign.default)({
    enable: false,
    // 等待图片，dom之类的加载完毕的延迟时间
    delay: 500
  }, cof.loadFull);
  var config = (0, _assign.default)({
    maxDistance: 100,
    refreshDistance: 40,
    statusChange: function statusChange() {},
    callback: function callback() {},
    direction: 'up',
    autoLoading: false
  }, cof);
  var currentSt = '';
  var childDown = ele.querySelector(".godz-pr-down");
  var childUp = ele.querySelector(".godz-pr-up");
  var indicatorEle = ele.querySelector('.godz-pr-text');
  var isUp = config.direction === 'both' || config.direction === 'up';
  var isDown = config.direction === 'both' || config.direction === 'down';
  /**
   * 是否锁定下拉刷新，上拉加载
   * true 锁定
   */

  var isLock = false;
  var startY = null;

  function touchstart(event) {
    startY = event.touches[0].clientY;
  }

  var downHeight = 0;
  var moving = false;

  function touchmove(event) {
    if (isLock || currentSt === 'release') return;
    var clientY = event.touches[0].clientY; // 直接阻止默认事件，防止警告

    if (moving) event.preventDefault();

    if (!moving && startY > clientY && isDown) {
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
    var diff = Math.round(clientY - startY);
    startY = clientY; // 设置过度效果

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

    if (window.innerHeight - clientY <= 50) {
      // uiwebview 如果手指移出屏幕外会不触发touchend
      // 在离底部距离50px的地方手动触发一次
      touchend();
    }
  }

  function touchend() {
    if (currentSt === 'activate') {
      (0, _utils.setTransition)(childDown, false);
      startY = null;
      currentSt = 'release';
      config.statusChange('release');
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
  var lastClientHeight = null;
  /**
   * 监听滚动事件，判断到底触发刷新
   */

  function scroll() {
    if (upLoading || isLock) return;

    if (startTop === null) {
      startTop = ele.scrollTop;
      return;
    } // 必须是向下滚动才行，方向不能错


    if (startTop >= ele.scrollTop) {
      startTop = null;
      return;
    }

    var bottomDistance = ele.scrollHeight - ele.scrollTop - ele.clientHeight;

    if (bottomDistance > 100) {
      // 没到到触发距离
      return;
    }

    upLoading = true;

    if (config.autoLoading) {
      showLoading();
    }

    config.callback(loadingCb);
  }

  function loadingCb() {
    if (config.autoLoading) {
      endSuccess();
    }
  }

  var eventList = {
    touchstart: touchstart,
    touchmove: touchmove,
    touchend: touchend
  };
  var disableFull = false;
  /**
   * 满屏加载
   */

  function fullLoad() {
    if (!(0, _utils.isFull)(ele)) {
      // 已经超过一屏了
      disableFull = true;
      return;
    }

    config.callback();
  }

  function init() {
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

    if (config.loadFull.enable) fullLoad();
  }

  function destory() {
    if (isDown) {
      var _arr2 = (0, _keys.default)(eventList);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var key = _arr2[_i2];
        ele.removeEventListener(key, eventList[key]);
      }
    }

    if (isUp) {
      ele.removeEventListener('scroll', scroll);
    }
  } // 展示loading效果


  function showLoading() {
    if (isUp) {
      childUp.style.visibility = 'visible';
    }

    if (isDown) {
      setTimeout(function () {
        // 获取 indicator高度
        (0, _utils.setHeight)(childDown, indicatorEle.clientHeight);
      }, 0);
    }
  }

  return {
    destory: destory,
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
        setTimeout(function () {
          (0, _utils.setHeight)(childDown, 0);
        });
      }

      if (!disableFull && config.loadFull.enable) {
        setTimeout(function () {
          fullLoad();
        }, config.loadFull.delay);
      }
    },
    init: init,
    lockScroll: function lockScroll(flag) {
      isLock = flag;
    },
    resetScroll: function resetScroll() {
      // 重置内部状态，通常用于tab切换
      // 重新判断是否满屏
      disableFull = false;

      if (config.loadFull.enable) {
        setTimeout(function () {
          fullLoad();
        }, config.loadFull.delay);
      }
    },
    showLoading: showLoading
  };
}

var _default = refresh;
exports.default = _default;