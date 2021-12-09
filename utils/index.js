export const isEmpty = (obj) => {
  // if (obj === undefined || obj === null) return true;
  // else return Object.keys(obj).length === 0;

  return Object.keys(obj).length === 0;
};