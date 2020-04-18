import Cookies from 'js-cookie';
import Vue from 'vue';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { randomText } from '@/common/util';
import { getRequest, postRequest } from '@/common/request';
import { LoginRequest, LoginUser, Ronten } from '@/types/app';

export const AUTH_COOKIE_KEY = 'ronten-logined';
export const emitter = new Vue();

/**
 * ログインをチェック
 */
export const checkAuth = (): boolean => {
  const auth = Cookies.get(AUTH_COOKIE_KEY);
  return Boolean(auth);
};

/**
 * ログイン画面へ
 */
export const checkAuthAndJump = (): void => {
  if (!checkAuth()) {
    console.log('ログインがめんへ');
    window.location.href = '/';
  }
};

@Module({ name: 'app', stateFactory: true, namespaced: true })
export default class MyClass extends VuexModule {
  loginUser = null as null | LoginUser;
  rontenList = [] as Ronten[];
  currentID = 0 as number;
  CLIENT_ID = randomText();

  // ----------------------
  // Mutation
  // ----------------------
  @Mutation
  LOGIN_USER(user: null | LoginUser) {
    this.loginUser = user;
  }

  // ----------------------
  // Action
  // ----------------------
  @Action
  async LoginCheckAction() {
    console.log('LoginCheckAction');
    const res = await getRequest('/api/logincheck', null);
    if (res.error) {
      this.LOGIN_USER(null);
      return res;
    }
    this.LOGIN_USER(res.user as LoginUser);
    return res;
  }

  @Action
  async Login(payload: LoginRequest) {
    const res = await postRequest('/api/login', payload);
    if (res.error) {
      return res;
    }
    return res;
  }

  @Action
  async Logout() {
    const res = await postRequest('/api/logout');
    if (res.error) {
      return res;
    }
    return res;
  }

  @Action
  async ListUsers() {
    const res = await getRequest('/api/user/list');
    if (res.error) {
      return res;
    }
    return res;
  }

  @Action
  async BackupAction() {
    const res = await postRequest('/api/storage/backup');
    if (res.error) {
      return res;
    }
    return res;
  }

  // ----------------------
  // get
  // ----------------------
  get logined(): boolean {
    return checkAuth();
  }
}
