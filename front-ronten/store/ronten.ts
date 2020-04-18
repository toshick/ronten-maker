import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { putRequest, deleteRequest, getRequest, postRequest } from '@/common/request';
import { Ronten, CreateRontenReq } from '@/types/app';

@Module({ name: 'ronten', stateFactory: true, namespaced: true })
export default class MyClass extends VuexModule {
  rontenList = [] as Ronten[];
  currentID = 0 as number;

  // ----------------------
  // Mutation
  // ----------------------
  @Mutation
  UPDATE_RONTEN_LIST(list: Ronten[]) {
    this.rontenList = list || [];
  }

  @Mutation
  SELECT_RONTEN(id: number) {
    this.currentID = id;
    this.rontenList = this.rontenList.map((d: Ronten) => {
      return { ...d, current: d.id === id };
    });
  }

  @Mutation
  REMOVE_RONTEN(id: number) {
    this.rontenList = this.rontenList.filter((d: Ronten) => {
      return d.id !== id;
    });
  }

  @Mutation
  UPDATE_RONTEN(ronten: Ronten) {
    const { id } = ronten;
    this.rontenList = this.rontenList.map((d: Ronten) => {
      if (d.id === id) {
        return { ...d, ...ronten };
      }
      return d;
    });
  }

  // ----------------------
  // Action
  // ----------------------
  @Action
  async GetRontenList(hash: string) {
    const res = await getRequest(`/api/ronten/list/${hash}`);
    if (res.error) {
      return res;
    }
    this.UPDATE_RONTEN_LIST(res.list);
    return res;
  }

  @Action
  async CreateRonten(params: CreateRontenReq) {
    const res = await postRequest('/api/ronten/new', params);
    if (res.error) {
      return res;
    }
    // リスト追加
    const list = this.rontenList.concat();
    list.unshift(res.created);
    this.UPDATE_RONTEN_LIST(list);
    return res;
  }

  @Action
  async RemoveRonten(id: number) {
    const res = await deleteRequest(`/api/ronten/${id}`);
    if (res.error) {
      return res;
    }

    // フェードアウトのためにremovedフラグを付与
    const r = this.rontenList.find((d: Ronten) => {
      return d.id === id;
    });
    if (r) {
      this.UPDATE_RONTEN({ ...r, removed: true });
    }
    return res;
  }

  @Action
  async UpdateRonten(ronten: Ronten) {
    const { id } = ronten;
    const res = await putRequest(`/api/ronten/${id}`, ronten);
    if (res.error) {
      return res;
    }
    this.UPDATE_RONTEN(ronten);
    return res;
  }
}
