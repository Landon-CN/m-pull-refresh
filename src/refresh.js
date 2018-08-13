import {
  isElement,
  setHeight,
  setTransition,
  dampingDiff,
  willPreventDefault,
  notPreventDefault,
} from './utils';

function refresh(ele, cof = {}) {
  if (!isElement(ele)) {
    // 不是dom元素
    throw new Error('m-pull-refresh need a dom element like div,not ' + typeof obj);
  }
  const config = Object.assign(
    {
      maxDistance: 200,
      refreshDistance: 40,
      statusChange: () => {},
      callback: () => {},
      direction: 'up',
    },
    cof,
  );
  let currentSt = '';
  const childDown = ele.querySelector(`.godz-pr-down`);
  const childUp = ele.querySelector(`.godz-pr-up`);
  const indicatorEle = ele.querySelector('.godz-pr-text');
  const isUp = config.direction === 'both' || config.direction === 'up';
  const isDown = config.direction === 'both' || config.direction === 'down';

  let startY = null;
  function touchstart(event) {
    startY = event.touches[0].screenY;
  }

  let downHeight = 0;
  let moving = false;
  function touchmove(event) {
    const screenY = event.touches[0].screenY;
    // 直接阻止默认事件，防止警告
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

    let diff = Math.round(screenY - startY);

    startY = screenY;
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
  }

  function touchend() {
    if (currentSt === 'activate') {
      downLoading = true;
      setTransition(childDown, false);
      startY = null;
      currentSt = 'release';
      config.statusChange('release');
      setTimeout(() => {
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

  let upLoading = false;
  let startTop = null;
  /**
   * 监听滚动事件，判断到底触发刷新
   */
  function scroll() {
    if (startTop === null) {
      startTop = ele.scrollTop;
      return;
    }

    // 必须是向下滚动才行，方向不能错
    if (startTop >= ele.scrollTop) {
      return;
    }

    const bottomDistance = ele.scrollHeight - ele.scrollTop - ele.clientHeight;
    if (upLoading || bottomDistance > 100) {
      // 加载中，或者没到到触发距离
      return;
    }
    upLoading = true;
    childUp.style.visibility = 'visible';
    config.callback();
  }

  const eventList = {
    touchstart,
    touchmove,
    touchend,
  };
  if (isDown) {
    for (const key of Object.keys(eventList)) {
      ele.addEventListener(key, eventList[key], willPreventDefault);
    }
  }

  if (isUp) {
    ele.addEventListener('scroll', scroll, notPreventDefault);
  }

  return {
    destory() {
      if (isDown) {
        for (const key of Object.keys(eventList)) {
          ele.removeEventListener(key, eventList[key]);
        }
      }
      if (isUp) {
        ele.removeEventListener('scroll', scroll);
      }
    },
    endSuccess() {
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
    },
  };
}

export default refresh;
