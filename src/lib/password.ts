export const generatePassword = (length = 16) => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  let result = "";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  for (let i = 0; i < length; i += 1) {
    result += charset[values[i] % charset.length];
  }
  return result;
};
