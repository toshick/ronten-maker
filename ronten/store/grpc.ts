import Cookies from 'js-cookie';
import { GetterTree } from 'vuex';
import { action, mutation, combineAction, combineMutation, actionCreatorFactory } from 'vuex-typescript-fsa';
import { credentials, Metadata } from 'grpc';
import { HelloRequest } from '@/proto/helloworld/helloworld_pb';
import { GreeterClient } from '@/proto/helloworld/HelloworldServiceClientPb';

const actionCreator = actionCreatorFactory({
  namespace: 'grpc',
});

// action
export const TestGRPCAction = actionCreator('TestGRPCAction');

/**
 * state
 */
export const state = () => ({});

export type RootState = ReturnType<typeof state>;

/**
 * getters
 */
export const getters: GetterTree<RootState, RootState> = {};

/**
 * mutations
 */
export const mutations = combineMutation<RootState>();

/**
 * actions
 */
export const actions = combineAction<RootState, RootState>();
/**
 * TestGRPCAction
 */
// action(TestGRPCAction, async ({ commit }, action) => {
//   const request = new HelloRequest();
//   request.setName(this.state.inputText);

//   const client = new GreeterClient('http://localhost:8080', {}, {});
//   client.sayHello(request, {}, (err, ret) => {
//     if (err || ret === null) {
//       throw err;
//     }
//     this.setState({ message: ret.getMessage() });
//   });
// }),
