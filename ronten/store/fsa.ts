import Cookies from 'js-cookie';
import { GetterTree } from 'vuex';
import { action, mutation, combineAction, combineMutation, actionCreatorFactory } from 'vuex-typescript-fsa';
import { getRequest, postRequest, deleteRequest, putRequest } from '@/common/request';
import { Ronten } from '@/types/app';

export const AUTH_COOKIE_KEY = 'ronten-logined';

const actionCreator = actionCreatorFactory({
  namespace: 'ronten',
});

// action
export const GetRontenListAction = actionCreator('GetRontenListAction');
export const AddRontenListAction = actionCreator<Ronten[]>('AddRontenListAction');
export const CreateRontenAction = actionCreator<Ronten>('CreateRontenAction');
export const RemoveRontenAction = actionCreator<number>('RemoveRontenAction');
export const UpdateRontenAction = actionCreator<Ronten>('UpdateRontenAction');

// mutation
export const UpdateRontenListMutation = actionCreator<Ronten[]>('UpdateRontenListMutation');
export const SelectRontenMutation = actionCreator<number>('SelectRontenMutation');
export const RemoveRontenMutation = actionCreator<number>('RemoveRontenMutation');
export const UpdateRontenMutation = actionCreator<Ronten>('UpdateRontenMutation');

/**
 * state
 */
export const state = () => ({
  rontenList: [] as Ronten[],
  currentID: 0 as number,
});

export type RootState = ReturnType<typeof state>;

/**
 * getters
 */
export const getters: GetterTree<RootState, RootState> = {
  rontenList: (state: RootState): Ronten[] => state.rontenList,
};

/**
 * mutations
 */
export const mutations = combineMutation<RootState>(
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
