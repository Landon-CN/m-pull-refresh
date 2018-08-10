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
const willPreventDefault = supportsPassive ? { passive: false } : false;

/**
 * 判断一个对象是不是dom对象
 * @param {} obj
 */
function isElement(obj) {
  return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

function isEdge(ele, direction) {
  if (ele.scrollTop <= 0 && direction === 'up') {
    return true;
  } else {
    return ele.clientHeight === ele.scrollHeight - ele.scrollTop;
  }
}

function setTransform(ele, y) {
  ele.style.transform = `translate3d(0,${y}px,0)`;
  ele.style.webkitTransform = `translate3d(0,${y}px,0)`;
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
    ele.style.transition = 'transform .3s,-webkit-transform .3s';
    ele.style.webkitTransition = 'transform .3s,-webkit-transform .3s';
  }
}

/**
 * 设置缓动，最大距离不会超过maxDistance
 */
function dampingDiff(diff, max) {
  const rate = Math.abs(diff) / window.screen.height;
  diff = diff * (1 - rate);

  if (diff > max) {
    return max;
  } else {
    return diff;
  }
}

function refresh(ele, cof = {}) {
  if (!isElement(ele)) {
    // 不是dom元素
    throw new Error('m-pull-refresh need a dom element like div,not ' + typeof obj);
  }
  const config = Object.assign(
    { maxDistance: 200, refreshDistance: 40, callback: () => {}, direction: 'up' },
    cof,
  );
  let currentSt = '';
  const child = ele.firstElementChild;
  const indicatorEle = child.firstElementChild;
  let startY = null;
  function touchstart(event) {
    currentSt = '';
  }
  function touchmove(event) {
    if (!isEdge(ele, config.direction)) {
      return;
    }

    const screenY = event.touches[0].screenY;
    if (startY === null) {
      startY = screenY;
      return;
    }
    let diff = Math.round(screenY - startY);
    if ((diff < 0 && config.direction === 'up') || (diff > 0 && config.direction === 'down')) {
      // 拖动方向不符合
      return;
    }

    event.preventDefault();
    setTransition(child, true);
    diff = dampingDiff(diff, config.maxDistance);
    setTransform(child, diff);
    if (diff < config.refreshDistance) {
      if (currentSt !== 'deactivate') {
        currentSt = 'deactivate';
        config.callback('deactivate');
      }
    } else {
      if (currentSt !== 'activate') {
        currentSt = 'activate';
        config.callback('activate');
      }
    }
  }

  function touchend() {
    if (currentSt === 'activate') {
      setTransition(child, false);
      startY = null;
      config.callback('release');
      setTimeout(() => {
        // 获取 indicator高度
        setTransform(child, indicatorEle.clientHeight);
      }, 0);
      setTimeout(() => {
        config.callback('finish');
        setTransform(child, 0);
      }, 1000);
    } else if (currentSt === 'deactivate') {
      startY = null;
      setTransition(child, false);
      setTransform(child, 0);
    }
  }

  const eventList = {
    touchstart,
    touchmove,
    touchend,
  };

  for (const key of Object.keys(eventList)) {
    ele.addEventListener(key, eventList[key], willPreventDefault);
  }

  return {
    destory() {
      for (const key of Object.keys(eventList)) {
        ele.removeEventListener(key, eventList[key]);
      }
    },
  };
}

window.refresh = refresh;
