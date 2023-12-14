import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/web/Home';
import AuthLayout from './layouts/AuthLayout';

export const publicRoutes = [
  { path: '/dang-nhap', component: Login, layout: AuthLayout },
  { path: '/dang-ky', component: Register, layout: AuthLayout },
];

export const privateRoutes = [{ path: '/', component: Home }];