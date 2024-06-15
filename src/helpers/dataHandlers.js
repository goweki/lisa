// Exclude keys from users
// export const excludeFields = (users, keys) => {
//   users.map((user) =>
//     Object.fromEntries(
//       Object.entries(user).filter(([key]) => !keys.includes(key))
//     )
//   );
// };
export function excludeFields(items, keys) {
  if (Array.isArray(items)) {
    return items.map((item) => excludeFields(item, keys));
  } else if (typeof items === "object" && items !== null) {
    return Object.fromEntries(
      Object.entries(items)
        .map(([key, value]) => {
          if (keys.includes(key)) {
            return []; // Exclude the password field
          }
          return [key, excludeFields(value, keys)];
        })
        .filter((entry) => entry.length > 0) // Filter out empty entries (i.e., the excluded password field)
    );
  } else {
    return items;
  }
}

// USE
// const keysToExclude = ['email', 'password'];
// const result = exclude(users, keysToExclude);

export function userByRole(items, keys) {
  if (Array.isArray(items)) {
    return items.map((item) => userByRole(item, keys));
  } else if (typeof items === "object" && items !== null) {
    return Object.fromEntries(
      Object.entries(items)
        .map(([key, value]) => {
          if (keys.includes(key)) {
            return []; // Exclude the password field
          }
          return [key, userByRole(value, keys)];
        })
        .filter((entry) => entry.length > 0) // Filter out empty entries (i.e., the excluded password field)
    );
  } else {
    return items;
  }
}

// USE
// const keysToExclude = ['email', 'password'];
// const result = exclude(users, keysToExclude);
