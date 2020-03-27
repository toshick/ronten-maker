import Cookies from 'js-cookie';
import { GetterTree } from 'vuex';
import { action, mutation, combineAction, combineMutation, actionCreator } from 'vuex-typescript-fsa';
import { getRequest, postRequest } from '@/common/request';
import { LoginRequest, LoginUser, Ronten } from '@/types/app';

export const AUTH_COOKIE_KEY = 'ronten-logined';

// action
export const LoginCheckAction = actionCreator('LoginCheckAction');
export const LoginAction = actionCreator<LoginRequest>('LoginAction');
export const LogoutAction = actionCreator('LogoutAction');
export const ListUsers = actionCreator('ListUsers');

// mutation
export const LoginUserMutation = actionCreator<LoginUser>('LoginUserMutation');

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

/**
 * state
 */
export const state = () => ({
  loginUser: null as null | LoginUser,
  rontenList: [] as Ronten[],
  currentID: 0 as number,
});

export type RootState = ReturnType<typeof state>;

/**
 * getters
 */
export const getters: GetterTree<RootState, RootState> = {
  logined: (): boolean => checkAuth(),
};

/**
 * mutations
 */
export const mutations = combineMutation<RootState>(
  /**
   * LoginUserMutation
   */
  mutation(LoginUserMutation, (state, action) => {
    state.loginUser = action.payload;
  }),
);

/**
 * actions
 */
export const actions = combineAction<RootState, RootState>(
  /**
   * LoginCheckAction
   */
  action(LoginCheckAction, async ({ commit }) => {
    // if (checkAuth()) return;
    console.log('LoginCheckAction');
    const res = await getRequest('/api/logincheck', null);
    if (res.error) {
      commit(LoginUserMutation.type, null);
      return res;
    }

    commit(LoginUserMutation.type, { payload: res.user as LoginUser });

    return res;
  }),

  /**
   * LoginAction
   */
  action(LoginAction, async (_, action) => {
    const res = await postRequest('/api/login', action.payload);
    if (res.error) {
      return res;
    }

    return res;
  }),

  /**
   * LogoutAction
   */
  action(LogoutAction, async (_, action) => {
    const res = await postRequest('/api/logout', action.payload);
    if (res.error) {
      return res;
    }

    return res;
  }),

  /**
   * ListUsers
   */
  action(ListUsers, async () => {
    const res = await getRequest('/api/user/list');
    if (res.error) {
      return res;
    }

    return res;
  }),
);
