import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { makeStoreTypes, makeStoreMod } from './lib';
import { getRequest, postRequest, deleteRequest, putRequest } from '@/common/request';
import { Ronten, CreateRontenReq } from '@/types/app';

const moduleName = 'ronten';

// action
const Act = makeStoreTypes(['GetRontenList', 'AddRontenList', 'CreateRonten', 'RemoveRonten', 'UpdateRonten']);
const Mut = makeStoreTypes(['UpdateRontenList', 'SelectRonten', 'AddRonten', 'RemoveRonten', 'UpdateRonten']);

export const A = makeStoreMod(Act, moduleName);
export const M = makeStoreMod(Mut, moduleName);

/**
 * state
 */
export const state = () => ({
  rontenList: [] as Ronten[],
  currentID: 0 as number,
});

type MyState = ReturnType<typeof state>;

/**
 * getters
 */
export const getters: GetterTree<MyState, MyState> = {
  rontenList: (state: MyState): Ronten[] => state.rontenList,
};

/**
 * mutations
 */
export const mutations: MutationTree<MyState> = {
  /**
   * UpdateRontenList
   */
  [Mut.UpdateRontenList](state, list) {
    state.rontenList = list || [];
  },

  /**
   * SelectRonten
   */
  [Mut.SelectRonten](state, id) {
    state.currentID = id;
    state.rontenList = state.rontenList.map((d: Ronten) => {
      return { ...d, current: d.id === id };
    });
  },

  /**
   * RemoveRonten
   */
  [Mut.RemoveRonten](state, id) {
    state.rontenList = state.rontenList.filter((d: Ronten) => {
      return d.id !== id;
    });
  },

  /**
   * UpdateRonten
   */
  [Mut.UpdateRonten](state, ronten: Ronten) {
    const { id } = ronten;
    state.rontenList = state.rontenList.map((d: Ronten) => {
      if (d.id === id) {
        return { ...d, ...ronten };
      }
      return d;
    });
  },
};

/**
 * actions
 */
export const actions: ActionTree<MyState, MyState> = {
  /**
   * GetRontenList
   */
  async [Act.GetRontenList]({ commit }, hash: string) {
    const res = await getRequest(`/api/ronten/list/${hash}`);
    if (res.error) {
      return res;
    }
    commit(Mut.UpdateRontenList, res.list);
    return res;
  },

  /**
   * CreateRonten
   */
  async [Act.CreateRonten]({ commit, state }, params: CreateRontenReq) {
    const res = await postRequest('/api/ronten/new', params);
    if (res.error) {
      return res;
    }

    // リスト追加
    const list = state.rontenList.concat();
    list.unshift(res.created);
    commit(Mut.UpdateRontenList, list);

    return res;
  },

  /**
   * RemoveRonten
   */
  async [Act.RemoveRonten]({ commit, state }, id) {
    const res = await deleteRequest(`/api/ronten/${id}`);
    if (res.error) {
      return res;
    }

    // フェードアウトのためにremovedフラグを付与
    const r = state.rontenList.find((d: Ronten) => {
      return d.id === id;
    });
    commit(Mut.UpdateRonten, { ...r, removed: true });
    return res;
  },

  /**
   * UpdateRonten
   */
  async [Act.UpdateRonten]({ commit }, ronten: Ronten) {
    const r = ronten;
    const { id } = r;
    const res = await putRequest(`/api/ronten/${id}`, r);
    if (res.error) {
      return res;
    }

    commit(Mut.UpdateRonten, r);
    return res;
  },
};
