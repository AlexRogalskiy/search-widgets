/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseURL } from '../url';

describe('parseURL function works perfectly', () => {
  test.each([
    ['3434d', 'http://3434d/'],
    ['a', 'http://a/'],
    [343434, 'http://0.5.61.138/'],
    [null, 'http://null/'],
    ['google.com', 'http://google.com/'],
  ])('parseURL($inputValue)', (inputValue, expected) => {
    expect(parseURL(inputValue as any)?.toString()).toBe(String(expected));
  });
});

describe('parseURL function fails', () => {
  test.each([[undefined, null]])('parseURL($inputValue)', (inputValue) => {
    expect(parseURL(inputValue as any)).toBeNull();
  });
});
