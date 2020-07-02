import { extend } from 'vee-validate';
import { required, email, is, numeric, max_value as maxValiue, min_value as minValiue } from 'vee-validate/dist/rules';

/**
 * is
 */
extend('is', {
  ...is,
  message: '入力値が不正です。',
});

/**
 * numeric
 */
extend('numeric', {
  ...numeric,
  message: '半角数字のみを入力してください。',
});

/**
 * max
 */
extend('max', (val, [length]: any) => {
  const lengthMax = +length;
  if (!val) return true;

  if (val.length <= lengthMax) {
    return true;
  }

  return `${lengthMax}文字以内で入力してください。`;
});

/**
 * maxval
 */
extend('max_value', {
  ...maxValiue,
  message: (_: string, rule: any) => {
    return `${rule.max}より小さい値を入力してください。`;
  },
});

/**
 * min_value
 */
extend('min_value', {
  ...minValiue,
  message: (_, rule: any) => {
    return `${rule.min}より大きい値を入力してください。`;
  },
});

/**
 * email
 */
extend('email', {
  ...email,
  message: 'メールアドレスが不正です。',
});

/**
 * required
 */
extend('required', {
  ...required,
  message: '必須項目です。',
});

/**
 * username
 */
extend('username', (val: string) => {
  if (val.match(/^[a-zA-Z0-9_-]+$/)) return true;

  return '不正な文字が含まれています。';
});
