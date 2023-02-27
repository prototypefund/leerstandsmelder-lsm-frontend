export function useFieldArray({ value, fieldName, object, single = false }) {
  if (!object[fieldName]) {
    object[fieldName] = "";
  }
  if (single) {
    object[fieldName] = value;
  } else {
    object[fieldName] = addOrRemove(object[fieldName], value);
  }

  function addOrRemove(array, value) {
    if (array == "" || array == "[]" || array == undefined) {
      array = [];
    }
    var index = array.indexOf(value);

    if (index === -1) {
      array.push(value);
    } else {
      array.splice(index, 1);
    }
    return array;
  }

  return {
    object,
  };
}
