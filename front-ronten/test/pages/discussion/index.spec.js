// import flushPromises from 'flush-promises';
import Index from '@/pages/discussion/index.vue';
import { getWrapper } from '@/test/setting';

/**
 * describe
 */
describe('Index', () => {
  let wrapper;
  beforeEach(() => {
    jest.spyOn(window.location, 'assign').mockImplementation((l) => {
      expect(l).toEqual('/create');
    });
    // window.location.assign.mockClear();
    wrapper = getWrapper(Index);
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
