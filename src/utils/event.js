export const throttle = (func, delay) => {
  let timeoutId = null;
  return (...args) => {
    console.log(args);
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        func(...args);
      }, delay);
    }
  };
};
