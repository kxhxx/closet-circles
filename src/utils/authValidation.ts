export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password: string) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};