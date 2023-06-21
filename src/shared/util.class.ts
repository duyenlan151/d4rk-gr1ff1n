export function* generateUUID() {
  const pattern = 'x4xx-yxxx-xxxxxxxxxxxx';

  while (true) {
    yield pattern.replace(/[xy]/g, function(char) {
      const randomHexDigit = Math.random() * 16 | 0;
      const hexDigit = char === 'x' ? randomHexDigit : (randomHexDigit & 0x3 | 0x8);
      return "a" + hexDigit.toString(16);
    });
  }
}