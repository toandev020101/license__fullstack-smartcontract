import React, { useState } from 'react';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../../components/form/InputField';
import { useNavigate } from 'react-router-dom';
import * as AuthApi from '../../../apis/authApi';
import JWTManager from '../../../utils/jwt';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    username: yup.string().required('Vui lòng nhập tên người dùng !'),
    password: yup.string().required('Vui lòng nhập mật khẩu !'),
  });

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const res = await AuthApi.login(values);
      if (!res.metadata) {
        toast.error('Đăng nhập thất bại!', { theme: 'colored', toastId: 'loginId', autoClose: 1500 });
      }

      const user = res.metadata.user;
      JWTManager.setToken(res.metadata.accessToken);
      navigate('/', {
        state: {
          toast: {
            type: 'success',
            message: 'Xin chào, ' + user.fullName,
            options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
          },
        },
      });
      form.reset();
      setIsLoading(false);
    } catch (error) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 404) {
        toast.error(data.message, { theme: 'colored', toastId: 'loginId', autoClose: 1500 });
      } else {
        navigate(`/error/${data.code}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)}>
      <InputField name="username" label="Tên tài khoản" form={form} type="text" required />
      <InputField name="password" label="Mật khẩu" form={form} type="password" required />
      <LoadingButton
        variant="contained"
        loading={isLoading}
        loadingIndicator="Loading…"
        type="submit"
        fullWidth
        sx={{
          backgroundColor: '#782CFF',
          color: '#fff',
          height: '45px',
          fontWeight: 600,
          margin: '20px 0',
          '&:hover': {
            backgroundColor: '#6511fd',
          },
        }}
      >
        Đăng nhập
      </LoadingButton>
    </Box>
  );
};

export default LoginForm;
