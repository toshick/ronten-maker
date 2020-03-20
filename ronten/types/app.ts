/* eslint camelcase: "off" */

export type LoginRequest = {
  pass: string;
  email: string;
};

export type LoginUser = {
  readonly id: number;
  name: string;
  email: string;
};

export type Ronten = {
  readonly id?: number;
  name: string;
  user_id: number;
  memo: string;
  removed?: boolean;
  current?: boolean;
};

// export type RontenCreateRequest = {
//   pass: string;
//   email: string;
// };
