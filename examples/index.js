function cb(status) {
  const ele = document.querySelector('.godz-pr-text');
  console.log(status);
  
  switch (status) {
    case 'deactivate':
      ele.innerHTML = '下拉刷新';
      break;
    case 'activate':
      ele.innerHTML = '释放加载';
      break;
    case 'release':
      ele.innerHTML = 'loading';
      break;
    case 'finish':
      ele.innerHTML = '加载完成';
      // a.destory();
      break;
    case 'down':
    default:
      break;
  }
}

let refreshInstance = refresh(document.querySelector('.list'), {
  direction: 'both',
  statusChange: cb,
  callback: () => {
    setTimeout(() => {
      refreshInstance.endSuccess();
    }, 0);
  },
});
