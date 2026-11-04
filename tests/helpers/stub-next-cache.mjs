// next/cache for the tests: unstable_cache simply calls the function.
export const unstable_cache = (fn) => (...args) => fn(...args);
export const revalidateTag = () => {};
export const revalidatePath = () => {};
