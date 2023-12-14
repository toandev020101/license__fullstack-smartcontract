import { Box, Typography } from '@mui/material';
import React from 'react';
import { BiSolidImage } from 'react-icons/bi';
import RegisterForm from './RegisterForm';
import { Link } from 'react-router-dom';

const Register = () => {
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
        Cuộc phiêu lưu bắt đầu từ đây 🚀
      </Typography>

      <Typography sx={{ margin: '10px 0 20px 0', fontSize: '15px', color: '#777' }}>
        Làm cho việc quản lý ứng dụng của bạn trở nên dễ dàng và thú vị!
      </Typography>

      <RegisterForm />

      <Typography sx={{ color: '#777', fontSize: '15px', textAlign: 'center' }}>
        Bạn đã có sẵn một tài khoản ?{' '}
        <Link to="/dang-nhap" style={{ textDecoration: 'none', color: '#782CFF' }}>
          Hãy đăng nhập
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
