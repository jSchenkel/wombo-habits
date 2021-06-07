

// input: list of strings
// output: formatted string with comma separated items WITH and before last item
export const arrayToCommaSeparatedString = (items) => {
  if (!items || items.length < 1) {
    return '';
  } else if (items.length === 1) {
    return items[0];
  } else {
    let finalString = '';

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (i === items.length - 1) {
          finalString = finalString + `and ${items[i]}`;
        } else {
          finalString = finalString + `${items[i]}, `;
        }
      }
    }

    return finalString;
  }
}
