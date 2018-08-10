function cb(status) {
  const ele = document.querySelector('.list-indicator').childNodes[0];
  console.dir(ele);
  
  switch (status) {
    case 'deactivate':
      ele.textContent = '下拉刷新';
      break;
    case 'activate':
      ele.textContent = '释放加载';
      break;
    case 'release':
      ele.textContent = 'loading';
      break;
    case 'finish':
      ele.textContent = '加载完成';
      // a.destory();
      break;
    default:
      break;
  }
}

let a = refresh(document.querySelector('.list'), {
  callback: cb,
});
