function createSelectionTip() {
  const tip = document.createElement('div');
  tip.style = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 16px;
    background: #1e80ff;
    color: white;
    border-radius: 4px;
    z-index: 9999;
  `;
  tip.textContent = 'Content has selected, summary generating...';
  return tip;
}

function throttle(fn, delay) {
  let timer = null

  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

document.addEventListener('mouseup', throttle(() => {
  const selection = window.getSelection().toString().trim();

  if (selection) {
    chrome.runtime.sendMessage({
      type: 'selected-content',
      content: selection
    });
    const tip = createSelectionTip();
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 2000);
  }
}, 500));

(function () {
  return window.getSelection().toString().trim();
})