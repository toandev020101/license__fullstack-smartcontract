import { Box, Typography } from '@mui/material';
import React from 'react';
import { BiSolidImage } from 'react-icons/bi';
import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      padding={'30px'}
      bgcolor={'#fff'}
      borderRadius={'5px'}
      boxShadow={'rgba(58, 53, 65, 0.1) 0px 2px 10px 0px'}
      width={'430px'}
      zIndex={99}
    >
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'10px'} marginBottom={'20px'}>
        <BiSolidImage style={{ fontSize: '40px', color: '#782CFF' }} />
        <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'uppercase', color: '#444' }}>
          ArtChain
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: '#444' }}>
        Chào mừng đến với ArtChain! 👋🏻
      </Typography>

      <Typography sx={{ margin: '10px 0 20px 0', fontSize: '15px', color: '#777' }}>
        Vui lòng đăng nhập vào tài khoản của bạn và bắt đầu cuộc phiêu lưu
      </Typography>

      <LoginForm />

      <Typography sx={{ color: '#777', fontSize: '15px', textAlign: 'center' }}>
        Mới trên nền tảng của chúng tôi?{' '}
        <Link to="/dang-ky" style={{ textDecoration: 'none', color: '#782CFF' }}>
          Tạo một tài khoản
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
