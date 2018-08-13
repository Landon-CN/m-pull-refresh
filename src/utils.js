/**
 * 判断一个对象是不是dom对象
 * @param {} obj
 */
export function isElement(obj) {
  return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

export function setHeight(ele, y) {
  y = y > 0 ? y : 0;
  ele.style.minHeight = `${y}px`;
}

/**
 * 设置/删除tansition动画
 * @param {*} ele
 * @param {*} del
 */
export function setTransition(ele, del) {
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
export function dampingDiff(diff, max, height) {
  if (height >= max && diff >= 0) {
    return 0;
  } else {
    const rate = Math.abs(diff) / window.screen.height;
    return diff * (1 - rate);
  }
}

// 判断是否支持 passive 属性
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassive = true;
    },
  });
  window.addEventListener('test', null, opts);
} catch (e) {}
export const willPreventDefault = supportsPassive ? { passive: false } : false;
export const notPreventDefault = supportsPassive ? { passive: true } : false;
