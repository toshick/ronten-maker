/* eslint camelcase: "off" */

export type FileItem = {
  file: File | null;
  filename: string;
  src?: string;
  txt?: string;
};

export type ValidationState = {
  passed: boolean;
  failed: boolean;
  errors: any[];
};

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
  readonly id: number;
  name: string;
  user_id: number;
  memo: string;
  removed?: boolean;
  current?: boolean;
};
