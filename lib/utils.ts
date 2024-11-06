import { produce } from "immer";

export function mergeWithObject<V>(
  obj1: Record<string, V>,
  obj2: Record<string, V>,
) {
  return produce(obj1, (draft) => {
    for (const key in obj2) {
      if (!Object.prototype.hasOwnProperty.call(draft, key)) {
        // @ts-expect-error - we are adding a new key to the object
        draft[key] = obj2[key];
      } else if (
        typeof draft[key] === "object" &&
        typeof obj2[key] === "object"
      ) {
        //@ts-expect-error - we are using recursion to merge objects
        draft[key] = mergeWithObject(draft[key], obj2[key]);
      } else {
        // @ts-expect-error - we are overwriting the key
        draft[key] = obj2[key];
      }
    }
  });
}
