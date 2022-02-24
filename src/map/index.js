const calcTimeLineWidth = clientWidth => {
  // 常量：除了时间轴外其他组件的宽度
  const OTHER_WIDTH = 783;
  return clientWidth - OTHER_WIDTH;
};

export default {
  calcTimeLineWidth
};
