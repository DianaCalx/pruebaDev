export const useLocalStorage = (key) => {
  const getItemLS = () => JSON.parse(localStorage.getItem(key));
  const setItemLS = (value) =>
    localStorage.setItem(key, JSON.stringify(value ?? undefined));
  const removeItemLS = () => localStorage.removeItem(key);
  return {
    getItemLS,
    setItemLS,
    removeItemLS,
  };
};
