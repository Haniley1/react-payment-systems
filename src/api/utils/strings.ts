export const removeSpaces = (value: string): string => {
  return value.replace(/\s/g, '');
}

export function declOfNum(n: number, text_forms: string[]) {
  n = Math.abs(n) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) { return text_forms[2]; }
  if (n1 > 1 && n1 < 5) { return text_forms[1]; }
  if (n1 === 1) { return text_forms[0]; }

  return text_forms[2];
}

export function classnames(relation: { [key: string]: boolean }): string {
  let result = ""

  for (let [key, value] of Object.entries(relation)) {
    if (value) {
      result += (key + " ")
    }
  }

  return result
}

export function makeID(length: number = 4) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
