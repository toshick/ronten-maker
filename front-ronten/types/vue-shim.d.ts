import Vue from 'vue';

declare module '*.vue' {
  export default Vue;
}

// declare module 'vue/types/vue' {
//   interface Vue {
//     $auth: firebase.auth.Auth;
//     $firestore: firebase.firestore.Firestore;
//   }
// }
