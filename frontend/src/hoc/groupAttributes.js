export const groupAttributes = (attributes) => {
  if (!Array.isArray(attributes)) {
    return {}; // Default to empty object if attributes is not an array
  }

  return attributes.reduce((acc, attr) => {
    if (!acc[attr.name]) {
      acc[attr.name] = [];
    }
    acc[attr.name].push(attr.value);
    return acc;
  }, {});
};
