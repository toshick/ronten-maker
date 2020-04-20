import Vue from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import Vue2TouchEvents from 'vue2-touch-events';
import axios from 'axios';
import sanitizeHTML from 'sanitize-html';
import OInput from '@/components/form/OInput.vue';
import OUpload from '@/components/form/OUpload.vue';
import Logo from '@/components/Logo.vue';
import Header from '@/components/Header.vue';
import '@/components/form/validation';

// Vue2TouchEvents;
Vue.use(Vue2TouchEvents);

// ValidationProvider;
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('OInput', OInput);
Vue.component('OUpload', OUpload);
Vue.component('Logo', Logo);
Vue.component('Header', Header);

// sanitizehtml;
Vue.prototype.$sanitize = sanitizeHTML;

// axios settings
axios.defaults.headers.common['X-Requested-By'] = 'ronten-requested-by';
Vue.prototype.$http = axios;

/**
 * 拡大縮小禁止
 */
document.addEventListener('touchmove', mobileNoScroll, { passive: false });

function mobileNoScroll(e: any) {
  if (e.touches.length >= 2) {
    // デフォルトの動作をさせない
    e.preventDefault();
  }
}
