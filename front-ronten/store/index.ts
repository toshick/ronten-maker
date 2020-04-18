import { Store } from 'vuex';
import { initialiseStores } from '@/common/store-accessor';
const initializer = (store: Store<any>) => initialiseStores(store);
export const plugins = [initializer];
export * from '@/common/store-accessor';
