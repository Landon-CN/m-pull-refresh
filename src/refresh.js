import {
  isElement,
  setHeight,
  setTransition,
  dampingDiff,
  willPreventDefault,
  notPreventDefault,
  isFull,
} from './utils';

function refresh(ele, cof = {}) {
  if (!isElement(ele)) {
    // 不是dom元素
    throw new Error('m-pull-refresh need a dom element like div,not ' + typeof obj);
  }

  cof.loadFull = Object.assign(
    {
      enable: false,
      // 等待图片，dom之类的加载完毕的延迟时间
      delay: 500,
    },
    cof.loadFull,
  );

  const config = Object.assign(
    {
      maxDistance: 100,
      refreshDistance: 40,
      statusChange: () => {},
      callback: () => {},
      direction: 'up',
      autoLoading: false,
    },
    cof,
  );

  let currentSt = '';
  const childDown = ele.querySelector(`.godz-pr-down`);
  const childUp = ele.querySelector(`.godz-pr-up`);
  const indicatorEle = ele.querySelector('.godz-pr-text');
  const isUp = config.direction === 'both' || config.direction === 'up';
  const isDown = config.direction === 'both' || config.direction === 'down';
  /**
   * 是否锁定下拉刷新，上拉加载
   * true 锁定
   */
  let isLock = false;

  let startY = null;
  function touchstart(event) {
    startY = event.touches[0].clientY;
  }

  let downHeight = 0;
  let moving = false;
  function touchmove(event) {
    if (isLock || currentSt === 'release') return;

    const clientY = event.touches[0].clientY;
    // 直接阻止默认事件，防止警告
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

    let diff = Math.round(clientY - startY);

    startY = clientY;
    // 设置过度效果
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

    if (window.innerHeight - clientY <= 50) {
      // uiwebview 如果手指移出屏幕外会不触发touchend
      // 在离底部距离50px的地方手动触发一次
      touchend();
    }
  }

  function touchend() {
    if (currentSt === 'activate') {
      setTransition(childDown, false);
      startY = null;
      currentSt = 'release';
      config.statusChange('release');
      if (config.autoLoading) {
        showLoading();
      }
      config.callback(loadingCb);
    } else if (currentSt === 'deactivate') {
      startY = null;
      setTransition(childDown, false);
      setHeight(childDown, 0);
    }
    downHeight = 0;
    moving = false;
  }

  let upLoading = false;
  let startTop = null;
  let lastClientHeight = null;
  /**
   * 监听滚动事件，判断到底触发刷新
   */
  function scroll() {
    if (upLoading || isLock) return;

    if (startTop === null) {
      startTop = ele.scrollTop;
      return;
    }

    // 必须是向下滚动才行，方向不能错
    if (startTop >= ele.scrollTop) {
      startTop = null;
      return;
    }

    const bottomDistance = ele.scrollHeight - ele.scrollTop - ele.clientHeight;
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
    if (config.autoLoading && !isLock) {
      endSuccess();
    }
  }

  const eventList = {
    touchstart,
    touchmove,
    touchend,
  };

  let disableFull = false;
  /**
   * 满屏加载
   */
  function fullLoad() {
    if (!isFull(ele)) {
      // 已经超过一屏了
      disableFull = true;
      return;
    }
    config.callback(loadingCb);
  }

  function init() {
    if (isDown) {
      for (const key of Object.keys(eventList)) {
        ele.addEventListener(key, eventList[key], willPreventDefault);
      }
    }

    if (isUp) {
      ele.addEventListener('scroll', scroll, notPreventDefault);
    }
    if (config.loadFull.enable) fullLoad();
  }
  function destory() {
    if (isDown) {
      for (const key of Object.keys(eventList)) {
        ele.removeEventListener(key, eventList[key]);
      }
    }
    if (isUp) {
      ele.removeEventListener('scroll', scroll);
    }
  }

  // 展示loading效果
  function showLoading() {
    if (isUp) {
      childUp.style.visibility = 'visible';
    }
    if (isDown) {
      setTimeout(() => {
        // 获取 indicator高度
        setHeight(childDown, indicatorEle.clientHeight);
      }, 0);
    }
  }

  function endSuccess() {
    // 加载结束回调，隐藏loading状态
    if (isUp) {
      childUp.style.visibility = 'hidden';
      upLoading = false;
      startTop = null;
    }

    if (isDown) {
      currentSt = 'finish';
      config.statusChange('finish');
      setTimeout(() => {
        setHeight(childDown, 0);
      });
    }
    if (!disableFull && config.loadFull.enable) {
      setTimeout(() => {
        fullLoad();
      }, config.loadFull.delay);
    }
  }

  return {
    destory,
    endSuccess,
    init,
    lockScroll(flag) {
      isLock = flag;
    },
    resetScroll() {
      // 重置内部状态，通常用于tab切换

      // 重新判断是否满屏
      disableFull = false;
      if (config.loadFull.enable) {
        setTimeout(() => {
          fullLoad();
        }, config.loadFull.delay);
      }
    },
    showLoading,
  };
}

export default refresh;
