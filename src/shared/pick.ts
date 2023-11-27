export const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  const finalObject: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObject[key] = obj[key];
    }
  }
  return finalObject;
};
export const userFilterableFields = [
  "searchTerm",
  "email",
  "Name",
  "Id",
  "created_by",
];
export const itemFilterableFields = ["searchTerm", "Name", "Id", "created_by"];
export const userSearchableFields = ["email", "Name", "Id", "created_by"];
export const itemSearchableFields = ["Name", "Id", "created_by"];
