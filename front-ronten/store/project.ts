import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { postRequest } from '@/common/request';
import { CreateProjectReq } from '@/types/app';

@Module({ name: 'project', stateFactory: true, namespaced: true })
export default class MyClass extends VuexModule {
  // ----------------------
  // Action
  // ----------------------
  @Action
  async CreateProject(name: string) {
    const params: CreateProjectReq = { hash: name, memo: '' };
    const res = await postRequest('/api/project/new', params);
    if (res.error) {
      return res;
    }
    return res.created;
  }
}
