import Buefy from 'buefy';
// import { ValidationProvider, ValidationObserver } from 'vee-validate';
// import VueRouter from 'vue-router';
import { createLocalVue, mount } from '@vue/test-utils';
export const localVue = createLocalVue();
localVue.use(Buefy);
// localVue.use(VueRouter);
// localVue.component('ValidationObserver', ValidationObserver);

/**
 * getWrapper
 */
export const getWrapper = (Component, params = {}) => {
  return mount(Component, {
    stubs: ['Logo', 'ValidationObserver'],
    localVue,
    ...params,
  });
};
