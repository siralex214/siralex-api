export const generateKey = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let key = "";
  for (let i = 0; i < 25; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    key += chars[randomIndex];
  }
  return key;
};
