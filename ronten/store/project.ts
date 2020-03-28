import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { makeStoreTypes, makeStoreMod } from './lib';
import { getRequest, postRequest, deleteRequest, putRequest } from '@/common/request';
import { Ronten } from '@/types/app';

const moduleName = 'project';

// action
const Act = makeStoreTypes(['CreateProject', 'RemoveProject', '', 'UpdateProject']);
const Mut = makeStoreTypes([]);

export const AP = makeStoreMod(Act, moduleName);
export const MP = makeStoreMod(Mut, moduleName);

/**
 * state
 */
export const state = () => ({});

type MyState = ReturnType<typeof state>;
type CreateProjectReq = { hash: string; memo: string };

/**
 * getters
 */
export const getters: GetterTree<MyState, MyState> = {};

/**
 * mutations
 */
export const mutations: MutationTree<MyState> = {};

/**
 * actions
 */
export const actions: ActionTree<MyState, MyState> = {
  /**
   * CreateRonten
   */
  async [Act.CreateProject](_, name) {
    const params: CreateProjectReq = { hash: name, memo: '' };
    const res = await postRequest('/api/project/new', params);
    if (res.error) {
      return res;
    }

    return res.created;
  },
};
