import num from './num';

/**
 * 무작위 문자
 * @example
 * str.random(); // 'JvDzLoS-_9p'
 */
export const random = (n: number = 11): string => {
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  let result = '';
  for (let i = 0; i < n; i++) {
    result += characters[num.random(0, characters.length - 1)];
  }
  return result;
};

/**
 * camel case로 변환
 * @example
 * str.camalize('abcd_efg'); => abcdEfg
 */

export const camelcase = (str: string) => {
  return str
    .replace(/[\s|_|-](.)/g, ($1) => $1.toUpperCase())
    .replace(/[\s|_|-]/g, '')
    .replace(/^(.)/, ($1) => $1.toLowerCase());
};

/**
 * snake case로 변환
 * @example
 * str.snakecase('abcdEfg'); => abcd_efg
 */
export const snakecase = (str: string | number) => {
  return str
    .toString()
    .replace(/[^A-Za-z0-9u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((char) => char.toLowerCase())
    .join('_');
};

/**
 * 3자리 마다 (,)콤마
 * @example
 * str.currency('1234' || 1234); => '1,234'
 */

export const currency = (str: string | number) => {
  const value = str.toString();
  return value.length
    ? parseInt(value.replace(/\D+/g, ''))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0';
};

/**
 * 전화번호 쪼개기
 * @example
 * split('029118562'); => ['02', '911', '8562'];
 * @case
 * 1. 010-XXXX-XXXX : 11자리 휴대폰번호
 * 2. 019-XXX-XXXX : 10자리 전화번호
 * 3. 02-XXXX-XXXX : 10자리 서울 전화번호
 * 4. 02-XXX-XXXX :  9자리 서울 전화번호
 */
export function phoneNumber(value: string) {
  const regex = /(02|\d{2,3})(\d{3,4})(\d{4})/g;
  const match = regex.exec(value);
  if (match) {
    const [, ...rest] = match;
    return rest;
  }
  return [];
}

const strs = {
  random,
  camelcase,
  snakecase,
  currency,
  phoneNumber,
};
export default strs;
