/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRange, paramToRange, rangeToParam } from '../range';

describe('isRange function', () => {
  test.each([
    [undefined, false],
    [null, false],
    [12, false],
    ['12', false],
    ['abc', false],
    [[], false],
    [[1], false],
    [['1'], false],
    [['1', 1], false],
    [[1, '1'], false],
    [[1, '1', 2], false],
    [[1, 2], true],
    [[2, 1], true],
  ])('isRange($inputValue)', (inputValue, expected) => {
    expect(isRange(inputValue)).toBe(expected);
  });
});

describe('rangeToParam function with invalid value', () => {
  test.each([[1, '1', null, undefined]])('rangeToParam($inputValue)', (inputValue) => {
    const withInvalidInput = (inputVal: any) => {
      try {
        rangeToParam(inputVal);
      } catch (err) {
        throw new Error();
      }
    };
    expect(() => {
      withInvalidInput(inputValue);
    }).toThrow();
  });
});

describe('rangeToParam function works perfectly', () => {
  test.each([
    [[1, 2], '1:2'],
    [[3, 1], '3:1'],
    [[4, 5], '4:5'],
  ])('rangeToParam($inputValue)', (inputValue, expectedOutput) => {
    expect(rangeToParam(inputValue as any)).toBe(expectedOutput);
  });
});

describe('rangeToParam function fails', () => {
  test.each([[[1, 3], '1:4']])('rangeToParam($inputValue)', (inputValue, expectedOutput) => {
    expect(rangeToParam(inputValue as any)).not.toBe(expectedOutput);
  });
});

describe('paramToRange function with invalid value', () => {
  test.each([1, null, undefined, {}])('paramToRange($inputValue)', (inputValue) => {
    const withInvalidInput = (inputVal: any) => {
      try {
        paramToRange(inputVal);
      } catch (err) {
        throw new Error();
      }
    };
    expect(() => {
      withInvalidInput(inputValue);
    }).toThrow();
  });
});

describe('paramToRange function works perfectly', () => {
  test.each([['1:2', [1, 2]]])('paramToRange($inputValue)', (inputValue, expectedOutput) => {
    expect(paramToRange(inputValue)).toStrictEqual(expectedOutput);
  });
});

describe('paramToRange function fails', () => {
  test.each([['1:2', [1, 3]]])('paramToRange($inputValue)', (inputValue, expectedOutput) => {
    expect(paramToRange(inputValue)).not.toStrictEqual(expectedOutput);
  });
});
