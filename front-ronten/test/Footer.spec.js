import { mount } from '@vue/test-utils';
import Footer from '@/components/Footer.vue';

describe('Footer', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Footer);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test('copyright', () => {
    const wrapper = mount(Footer);
    expect(wrapper.find('p').text()).toBe('copyright toshick of the world');
  });

  test('copyright', () => {
    const wrapper = mount(Footer, { propsData: { bottom: true } });
    expect(wrapper.classes()).toContain('is-bottom');
  });
});
