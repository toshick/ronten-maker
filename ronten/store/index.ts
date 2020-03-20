import Cookies from 'js-cookie';
import { GetterTree } from 'vuex';

import { action, mutation, combineAction, combineMutation, actionCreator } from 'vuex-typescript-fsa';

import { getRequest, postRequest, deleteRequest, putRequest } from '@/common/request';

import { LoginRequest, LoginUser, Ronten } from '@/types/app';

export const AUTH_COOKIE_KEY = 'ronten-logined';
// action
export const LoginCheckAction = actionCreator('LoginCheckAction');
export const LoginAction = actionCreator<LoginRequest>('LoginAction');
export const LogoutAction = actionCreator('LogoutAction');
export const GetRontenListAction = actionCreator('GetRontenListAction');
export const AddRontenListAction = actionCreator<Ronten[]>('AddRontenListAction');
export const CreateRontenAction = actionCreator<Ronten>('CreateRontenAction');
export const RemoveRontenAction = actionCreator<number>('RemoveRontenAction');
export const UpdateRontenAction = actionCreator<Ronten>('UpdateRontenAction');

// mutation
export const UpdateRontenListMutation = actionCreator<Ronten[]>('UpdateRontenListMutation');
export const LoginUserMutation = actionCreator<LoginUser>('LoginUserMutation');
export const SelectRontenMutation = actionCreator<number>('SelectRontenMutation');
export const RemoveRontenMutation = actionCreator<number>('RemoveRontenMutation');
export const UpdateRontenMutation = actionCreator<Ronten>('UpdateRontenMutation');

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
  rontenList: (state: RootState): Ronten[] => state.rontenList,
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

  /**
   * UpdateRontenListMutation
   */
  mutation(UpdateRontenListMutation, (state, action) => {
    state.rontenList = action.payload;
  }),

  /**
   * SelectRontenMutation
   */
  mutation(SelectRontenMutation, (state, action) => {
    const id = action.payload;
    state.currentID = id;
    state.rontenList = state.rontenList.map((d: Ronten) => {
      return { ...d, current: d.id === id };
    });
  }),

  /**
   * RemoveRontenMutation
   */
  mutation(RemoveRontenMutation, (state, action) => {
    const id = action.payload;
    state.rontenList = state.rontenList.filter((d: Ronten) => {
      return d.id !== id;
    });
  }),

  /**
   * UpdateRontenMutation
   */
  mutation(UpdateRontenMutation, (state, action) => {
    const r = action.payload;
    console.log('こうしん', r);
    const { id } = r;
    state.rontenList = state.rontenList.map((d: Ronten) => {
      if (d.id === id) {
        return { ...d, ...r };
      }
      return d;
    });
  }),

  /**
   * AddRontenListAction
   */
  mutation(AddRontenListAction, (state, action) => {
    const list = action.payload;
    state.rontenList = list.map((d: Ronten) => {
      return {
        ...d,
        current: d.id === state.currentID,
        removed: d.removed || false,
      };
    });
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
   * GetRontenListAction
   */
  action(GetRontenListAction, async ({ commit }) => {
    const res = await getRequest('/api/ronten/list');
    if (res.error) {
      return res;
    }
    commit(UpdateRontenListMutation.type, { payload: res.list });
    return res;
  }),

  /**
   * CreateRontenAction
   */
  action(CreateRontenAction, async ({ commit, state }, action) => {
    const res = await postRequest('/api/ronten/new', action.payload);
    if (res.error) {
      return res;
    }

    // リスト追加
    const list = state.rontenList.concat();
    list.unshift(res.created);
    commit(AddRontenListAction.type, { payload: list });

    return res;
  }),

  /**
   * RemoveRontenAction
   */
  action(RemoveRontenAction, async ({ commit, state }, action) => {
    const id = action.payload;
    const res = await deleteRequest(`/api/ronten/${id}`);
    if (res.error) {
      return res;
    }

    // フェードアウトのためにremovedフラグを付与
    const r = state.rontenList.find((d: Ronten) => {
      return d.id === id;
    });
    commit(UpdateRontenMutation.type, { payload: { ...r, removed: true } });
    return res;
  }),

  /**
   * UpdateRontenAction
   */
  action(UpdateRontenAction, async ({ commit }, action) => {
    const r = action.payload;
    const { id } = r;
    const res = await putRequest(`/api/ronten/${id}`, r);
    if (res.error) {
      return res;
    }

    commit(UpdateRontenMutation.type, { payload: r });
    return res;
  }),
);
