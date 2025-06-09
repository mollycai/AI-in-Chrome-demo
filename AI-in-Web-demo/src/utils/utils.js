import { ElMessage } from "element-plus";

export const handleCopy = (event) => {
  navigator.clipboard
    .writeText(event.target.closest("pre").querySelector("code").innerText)
    .then(() => ElMessage.success("复制成功"))
    .catch(() => ElMessage.error("复制失败"));
};

export const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      return;
    }
		timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
