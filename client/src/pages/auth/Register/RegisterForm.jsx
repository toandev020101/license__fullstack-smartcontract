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

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    fullName: yup.string().required('Vui lòng nhập họ và tên !'),
    username: yup.string().required('Vui lòng nhập tên người dùng !'),
    password: yup.string().required('Vui lòng nhập mật khẩu !'),
    confirmPassword: yup
      .string()
      .required('Vui lòng nhập xác nhận mật khẩu !')
      .oneOf([yup.ref('password')], 'Không khớp mật khẩu!'),
  });

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const res = await AuthApi.register(values);
      if (!res.metadata) {
        toast.error('Đăng ký thất bại!', { theme: 'colored', toastId: 'registerId', autoClose: 1500 });
      }

      const user = res.metadata.user;
      JWTManager.setToken(res.metadata.accessToken);
      navigate('/', {
        state: {
          notify: {
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
        toast.error(data.message, { theme: 'colored', toastId: 'registerId', autoClose: 1500 });
      } else {
        navigate(`/error/${data.code}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)}>
      <InputField name="fullName" label="Họ và tên" form={form} type="text" required />
      <InputField name="email" label="Email" form={form} type="text" />
      <InputField name="username" label="Tên tài khoản" form={form} type="text" required />
      <InputField name="password" label="Mật khẩu" form={form} type="password" required />
      <InputField name="confirmPassword" label="Xác nhận mật khẩu" form={form} type="password" required />
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
        Đăng ký
      </LoadingButton>
    </Box>
  );
};

export default RegisterForm;
