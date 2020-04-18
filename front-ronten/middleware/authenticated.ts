import Cookies from 'js-cookie';
import { AUTH_COOKIE_KEY } from '@/store/app';

export default function({ redirect, route }: { redirect: any; route: any }) {
  const session = Cookies.get(AUTH_COOKIE_KEY);

  const { path } = route;
  console.log('path', path, 'session', session);
  if (path.includes('login') || path.includes('policy')) return;
  // ユーザーが認証されていないとき
  // if (!session) {
  //   return redirect('/login');
  // }
}
