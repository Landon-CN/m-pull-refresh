"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isElement = isElement;
exports.setHeight = setHeight;
exports.setTransition = setTransition;
exports.dampingDiff = dampingDiff;
exports.isFull = isFull;
exports.notPreventDefault = exports.willPreventDefault = void 0;

/**
 * 判断一个对象是不是dom对象
 * @param {} obj
 */
function isElement(obj) {
  return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

function setHeight(ele, y) {
  y = y > 0 ? y : 0;
  ele.style.height = "".concat(y, "px");
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
    ele.style.transition = 'height .3s';
    ele.style.webkitTransition = 'height .3s';
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
exports.willPreventDefault = willPreventDefault;
var notPreventDefault = supportsPassive ? {
  passive: true
} : false;
/**
 * 内容充满一屏
 * @param {*} ele
 */

exports.notPreventDefault = notPreventDefault;

function isFull(ele) {
  return ele.clientHeight <= ele.scrollHeight;
}