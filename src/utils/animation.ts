
export const pageTransitionVariants = {
  initial: "transition-transform duration-500 translate-x-full rotate-y-90 opacity-0",
  animate: "transition-transform duration-500 translate-x-0 rotate-y-0 opacity-100",
  exit: "transition-transform duration-500 -translate-x-full rotate-y-90 opacity-0",
};

export const dialogTransitionVariants = {
  initial: "transition-all duration-300 scale-90 rotate-y-90 opacity-0",
  animate: "transition-all duration-300 scale-100 rotate-y-0 opacity-100",
  exit: "transition-all duration-300 scale-90 rotate-y-90 opacity-0",
};
