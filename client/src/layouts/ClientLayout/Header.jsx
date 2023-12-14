import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JWTManager from '../../utils/jwt';
import { ToastContainer, toast } from 'react-toastify';
import * as UserApi from '../../apis/userApi';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { toastSuccess } = location.state;
      toast.success(toastSuccess.message, toastSuccess.options);
    }
  }, [location]);

  useEffect(() => {
    const loginSuccess = async () => {
      const userId = JWTManager.getUserId();
      const res = await UserApi.getOneById(userId);
      const user = res.metadata.user;
      toast.success('Xin chào, ' + user.fullName, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
    };

    const isLogin = async () => {
      try {
        const token = JWTManager.getToken();
        if (token) {
          loginSuccess();
        } else {
          const success = await JWTManager.getRefreshToken();
          if (success) {
            loginSuccess();
          } else {
            navigate('/dang-nhap', {
              state: {
                toastError: {
                  message: 'Vui lòng đăng nhập !',
                  options: { theme: 'colored', toastId: 'loginId', autoClose: 1500 },
                },
              },
            });
          }
        }
      } catch (error) {
        const { data } = error.response;
        if (data.code === 400 || data.code === 404) {
          toast.error(data.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else if (data.code === 500) {
          navigate('/error/500');
        }
      }
    };

    isLogin();
  }, [navigate]);

  return (
    <Box>
      <ToastContainer />
    </Box>
  );
};

export default Header;
