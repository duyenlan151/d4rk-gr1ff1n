import { sum } from './sum';

describe('Utils: Sum', () => {
  it('should return correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
