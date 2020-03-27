import { ActionTree, MutationTree, GetterTree, ActionContext, MutationPayload } from 'vuex';
// import { getRequest, postRequest, deleteRequest, putRequest } from '@/common/request';
// import { Ronten } from '@/types/app';
import { ActionFactory, actionWrapper, mutationWrapper } from './lib';

/**
 * string[]からEnumを生成する
 */
function stringToEnum<T extends string>(o: T[]): { [K in T]: K } {
  return o.reduce((accumulator, currentValue) => {
    accumulator[currentValue] = currentValue;
    return accumulator;
  }, Object.create(null));
}

export const Actions = stringToEnum(['ACT1', 'ACT2']);
export const Mutations = stringToEnum(['Mutate1', 'Mutate2']);

type ActionType = keyof typeof Actions;
type MutationType = keyof typeof Mutations;

const modulename = 'simple';
export const simpleAction1 = ActionFactory(Actions.ACT1, modulename);

/**
 * state
 */
export const state = () => ({
  simpleTitle: 'シンプル',
});

export type MyState = ReturnType<typeof state>;

/**
 * getters
 */
export const getters: GetterTree<MyState, MyState> = {
  title: (state) => {
    return state.simpleTitle;
  },
};

/**
 * mutations
 */
export const mutations = mutationWrapper<MutationType, MyState>({});

mutations.Mutate1 = (state, params) => {
  state.simpleTitle = params;
};

mutations.Mutate2 = (state, params) => {
  state.simpleTitle = params;
};

/**
 * actions
 */
export const actions = actionWrapper<ActionType, MutationType, MyState, MyState>({});

actions.ACT1 = ({ commitM }, params) => {
  const t = Math.floor(Math.random() * 100);
  commitM('Mutate1', `${params.payload}-${t}`);
};

actions.ACT2 = ({ commitM }, params) => {
  const t = Math.floor(Math.random() * 100);
  commitM('Mutate2', `${params.payload}-${t}`);
};
