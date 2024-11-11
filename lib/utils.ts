import { produce } from "immer";

export function mergeWithObject<Obj extends object>(obj1: Obj, obj2: Obj) {
  if (Object.keys(obj2).length === 0) {
    return obj1;
  } else if (Object.keys(obj1).length === 0) {
    return obj2;
  }

  return produce(obj1, (draft) => {
    for (const key in obj2) {
      if (!Object.prototype.hasOwnProperty.call(draft, key)) {
        // @ts-expect-error - we are adding a new key to the object
        draft[key] = obj2[key];
      } else if (
        //@ts-expect-error draft is an object
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
