import flushPromises from 'flush-promises';
import { getWrapper } from '@/test/setting';
import DiscussionDetail from '@/pages/discussion/_id.vue';
jest.mock('@/store');

/**
 * mock
 */
jest.mock('@/store', () => ({
  rontenStore: {
    rontenList: [],
    GetRontenList: () => Promise.resolve({}),
  },
  appStore: {
    CLIENT_ID: 'TEST_CLIENT_ID',
  },
}));
jest.mock('@/common/util', () => ({
  toastNG: () => Promise.resolve(),
  randomText: () => 'randomtxt',
  sleep: () => Promise.resolve(),
}));

/**
 * describe
 */
describe('page create', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = getWrapper(DiscussionDetail, { mocks: { $route: { params: { id: '/discussion/XXXXXXXX' } } } });
  });

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  // it('新規ディスカッション', async () => {
  //   expect(wrapper.vm.sending).toBeFalsy();
  //   const $btn = wrapper.find('.buttons button');
  //   expect($btn.exists()).toBeTruthy();
  //   $btn.trigger('click');
  //   expect(wrapper.vm.sending).toBeTruthy();
  //   await flushPromises();
  //   expect(wrapper.vm.sending).toBeFalsy();
  // });
});
