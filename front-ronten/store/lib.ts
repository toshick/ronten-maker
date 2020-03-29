import { ActionTree, MutationTree, ActionContext, MutationPayload, Mutation } from 'vuex';

export type ActionItem = {
  // (): (payload: any) => any;
  actionname: string;
  type: string;
  modulename: string;
};

/**
 * アクションを返却する
 */
export function ActionFactory(name: string, modulename: string): ActionItem {
  const type = `${modulename}/${name}`;
  const mufunc = (payload: any) => {
    return {
      type,
      payload,
    };
  };
  return Object.assign(mufunc, {
    actionname: name,
    type: `${modulename}/${name}`,
    modulename,
  });
}

// ----------------------
// actionWrapper
// ----------------------

/**
 * ActionTreeの拡張
 * キーを指定のUnionTypeで制限する
 */
export type ActionTree2<T extends string, M extends string, S, R> = { [key in T]?: Callback<M, S, R> };

/**
 * commitMメソッドをcontextに追加する
 * 自分のmutationタイプ（T:文字列）による型チェックを実行可能とする
 */
type Callback<M extends string, S, R> = (ctx: ActionContextWrapper<M, S, R>, action: MutationPayload) => any;

/**
 * [commitM]を追加したActionContext
 */
interface ActionContextWrapper<M extends string, S, R> extends ActionContext<S, R> {
  commitM: (mutation: M, params: any) => void;
}

/**
 * actionをラップする
 */
export function actionWrapper<T extends string, M extends string, S, R>(tree: ActionTree<S, R>): ActionTree2<T, M, S, R> {
  // const ret: ActionTree2<T, M, S, R> = {};
  const ret: any = {};
  for (const [key, callback] of Object.entries(tree)) {
    ret[key] = eachAction<M, S, R>(callback as Callback<M, S, R>);
  }
  return ret;
}

/**
 * ContextにcommitMメソッドを追加する
 * 指定のUionTypeのキーでmutationを制限する
 */
function eachAction<M extends string, S, R>(callback: Callback<M, S, R>): Callback<M, S, R> {
  return (ctx, action) => {
    const commitM = (mutation: M, params: any) => {
      ctx.commit(mutation, params);
    };
    return callback({ ...ctx, commitM }, action);
  };
}

// ----------------------
// mutationWrapper
// ----------------------

export type MutationItem2<T extends string, S> = { [key in T]?: Mutation<S> };

/**
 * mutationをラップする
 */
export function mutationWrapper<T extends string, S>(tree: MutationTree<S>): MutationItem2<T, S> {
  // const ret: MutationItem2<T, S> = {};
  const ret: any = {};
  for (const [key, callback] of Object.entries(tree)) {
    ret[key] = callback as Mutation<S>;
  }
  return ret;
}

/**
 * string[]からEnumを生成する
 */
export function makeStoreTypes<T extends string>(o: T[]): { [K in T]: K } {
  return o.reduce((accumulator, currentValue) => {
    accumulator[currentValue] = currentValue;
    return accumulator;
  }, Object.create(null));
}

/**
 * module用
 */
export function makeStoreMod<T>(o: T, module: string): { [P in keyof T]: string } {
  const ret: any = {};
  Object.entries(o).forEach(([key, val]) => {
    ret[key] = module + '/' + val;
  });

  return ret;
}
