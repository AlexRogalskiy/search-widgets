/* eslint-disable @typescript-eslint/no-explicit-any */
import { getComputedStyleForElement, parseBreakpoints, parseRatio } from '../styles';

describe('parseBreakpoints function', () => {
  test.each([
    [
      639,
      {
        sm: false,
        md: false,
        lg: false,
        xl: false,
      },
    ],
    [
      641,
      {
        sm: true,
        md: false,
        lg: false,
        xl: false,
      },
    ],
    [
      800,
      {
        sm: true,
        md: true,
        lg: false,
        xl: false,
      },
    ],
    [
      1025,
      {
        sm: true,
        md: true,
        lg: true,
        xl: false,
      },
    ],
    [
      1281,
      {
        sm: true,
        md: true,
        lg: true,
        xl: true,
      },
    ],
  ])('parseBreakpoints($inputValue)', (inputValue, expected) => {
    expect(parseBreakpoints(inputValue as any)).toStrictEqual(expected);
  });
});

describe('getComputedStyleForElement function', () => {
  it('should return', () => {
    document.head.innerHTML = `
      <style>
        .test-class-1 { color:red; }
        .test-class-2 { border-radius: 8px; }
      </style>
    `;
    document.body.innerHTML = `
      <div lass="test-class-1 test-class-2">Visible Example</div>
    `;

    expect(getComputedStyleForElement('color', 'div', ['test-class-1', 'test-class-2'])).toBe('red');
    expect(getComputedStyleForElement('border-radius', 'div', ['test-class-1', 'test-class-2'])).toBe('8px');
  });
});

describe('parseRatio function with invalid input', () => {
  test.each([[1, null, undefined, {}]])('parseRatio($inputValue)', (inputValue) => {
    const withInvalidInput = (inputVal: any) => {
      try {
        parseRatio(inputVal);
      } catch (err) {
        throw new Error();
      }
    };
    expect(() => {
      withInvalidInput(inputValue);
    }).toThrow();
  });
});

describe('parseRatio function works perfectly', () => {
  test.each([
    ['1:2', 1],
    ['3:1', 3],
    ['4:5', 4],
    ['4/5', 0.8],
    ['9/4', 2.25],
  ])('parseRatio($inputValue)', (inputValue, expected) => {
    expect(parseRatio(inputValue)).toStrictEqual(expected);
  });
});

describe('parseRatio function fails', () => {
  test.each([['test']])('parseRatio($inputValue)', (inputValue) => {
    expect(parseRatio(inputValue)).toBeNaN();
  });
});
