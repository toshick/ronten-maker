import flushPromises from 'flush-promises';
import { getWrapper } from '@/test/setting';
import create from '@/pages/create.vue';
jest.mock('@/store');

/**
 * mock
 */
jest.mock('@/store', () => ({
  projectStore: {
    CreateProject: () => Promise.resolve({ error: 'value' }),
  },
}));
jest.mock('@/common/util', () => ({
  toastNG: () => Promise.resolve(),
  randomText: () => 'randomtxt',
}));

/**
 * describe
 */
describe('page create', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = getWrapper(create);
  });

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('新規ディスカッション', async () => {
    expect(wrapper.vm.sending).toBeFalsy();
    const $btn = wrapper.find('.buttons button');
    expect($btn.exists()).toBeTruthy();
    $btn.trigger('click');
    expect(wrapper.vm.sending).toBeTruthy();
    await flushPromises();
    expect(wrapper.vm.sending).toBeFalsy();
  });
});
