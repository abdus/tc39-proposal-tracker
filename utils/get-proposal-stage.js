/**
 * IDEA
 * ----
 *
 * Step 1:
 * If the regex returns exctly one item, parse the item
 * and get the version Number
 *
 * Step 2:
 * If regex returns two items, parse all items and get the bigger number
 *
 * Step 3:
 * If regex returns greater than or equal to 3,
 * parse all items and return the number with most occurence
 *
 *    Step 3.1:
 *    If two number have same occurence, get the bigger number
 *
 * @param {array} param
 */

function getStageNumber(param = []) {
  // check if the param is actually an array. if not, just return 0.
  if (!Array.isArray(param)) return 0;

  // get the array length
  const arrLength = param.length;

  const numbers = param
    .toString()
    .toLowerCase()
    .split('stage ');

  if (arrLength === 1) {
    return parseInt(param.toString().split(' ')[1]);
  } else if (arrLength === 2) {
    return parseInt(numbers.reduce((acc, cur) => (acc >= cur ? acc : cur)));
  } else if (arrLength >= 3) {
    return parseInt(mode(numbers).reduce((acc, cur) => (acc >= cur ? acc : cur)));
  }
}

/**
 * Getting the most frequent element from an array
 *
 * @param {array} array
 */

function mode(array = []) {
  // check if it is an array and have atleast a single element
  if (!Array.isArray(array)) {
    throw new Error(`Please provide an array as argument`);
  }

  const counter = {};
  let maxElement = [];
  let maxCount = 1;

  for (const element of array) {
    if (!counter[element]) {
      counter[element] = 1;
    } else {
      counter[element]++;
    }

    if (counter[element] > maxCount) {
      maxElement = [element];
      maxCount = counter[element];
    } else if (counter[element] === maxCount) {
      maxElement.push(element);
    }
  }

  return maxElement;
}

/**
 * Export the function `getStageNumber`
 */

module.exports = getStageNumber;
