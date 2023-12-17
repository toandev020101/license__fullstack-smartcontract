import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LicenseManager from './pages/web/LicenseManager';
import AddLicense from './pages/web/LicenseManager/AddLicense';
import AuthLayout from './layouts/AuthLayout';
import Profile from './pages/web/User';

export const publicRoutes = [
  { path: '/dang-nhap', component: Login, layout: AuthLayout },
  { path: '/dang-ky', component: Register, layout: AuthLayout },
];

export const privateRoutes = [
  { path: '/quan-ly-ban-quyen/them-moi', component: AddLicense },
  { path: '/tai-khoan/ho-so', component: Profile },
  { path: '/', component: LicenseManager },
];
