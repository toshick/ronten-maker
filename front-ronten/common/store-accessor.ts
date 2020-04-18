/* eslint import/no-mutable-exports: 0 */

import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import AppClass from '~/store/app';
import ProjectClass from '~/store/project';
import RontenClass from '~/store/ronten';

let appStore: AppClass;
let projectStore: ProjectClass;
let rontenStore: RontenClass;

/**
 * initialiseStores
 */
function initialiseStores(store: Store<any>): void {
  appStore = getModule(AppClass, store);
  projectStore = getModule(ProjectClass, store);
  rontenStore = getModule(RontenClass, store);
}

export { initialiseStores, appStore, projectStore, rontenStore };
