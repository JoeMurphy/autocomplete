// Takes a list of items and returns a list with only unique items
export const unique = (arr) => {
  const uniqueList = new Set(arr);

  return Array.from(uniqueList);
};
