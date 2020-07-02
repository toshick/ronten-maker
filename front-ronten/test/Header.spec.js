import flushPromises from 'flush-promises';
import { getWrapper } from '@/test/setting';
import Header from '@/components/Header.vue';
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
describe('Header', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = getWrapper(Header);
  });

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('ボトム', () => {
    expect(wrapper.find('.bottom')).toBeTruthy();
  });

  it('新規ボタン', async () => {
    expect(wrapper.vm.sending).toBeFalsy();
    const $btn = wrapper.find('.btns button');
    expect($btn.exists()).toBeTruthy();
    $btn.trigger('click');
    expect(wrapper.vm.sending).toBeTruthy();
    await flushPromises();
    expect(wrapper.vm.sending).toBeFalsy();
  });
});
