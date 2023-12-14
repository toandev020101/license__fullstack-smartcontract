import { Box, Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import TitlePage from './TitlePage';

const Error = ({ type }) => {
  const errors = {
    401: {
      title: 'Không có quyền truy cập',
      image: '/images/401-error.png',
      message: 'Xin lỗi, bạn không có quyền truy cập!',
    },

    403: {
      title: 'Không có quyền truy cập',
      image: '/images/403-error.png',
      message: 'Xin lỗi, bạn không có quyền truy cập!',
    },

    404: {
      title: 'Trang không tồn tại',
      image: '/images/404-error.png',
      message: 'Xin lỗi, chúng tôi không tìm thấy trang mà bạn cần!!',
    },

    500: {
      title: 'Hệ thống gặp trục trặc',
      image: '/images/500-error.png',
      message: 'Xin lỗi, có vẻ server của chúng tôi đang gặp trục trặc!',
    },
  };

  return (
    <>
      <TitlePage title={errors[type].title} />
      <Grid
        container
        spacing={1}
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: '#fff',
          color: '#782CFF',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 99999,
        }}
      >
        <Grid item md={6}>
          <Box display="flex" justifyContent="flex-end" alignItems="center" height="100%">
            <img src={errors[type].image} alt={type + '-error.png'} width="60%" />
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box display="flex" flexDirection="column" justifyContent="center" gap="40px" height="100%">
            <Typography variant="h3" fontWeight={500} width="60%" textAlign="center">
              {errors[type].message}
            </Typography>
            <Box display="flex" justifyContent="center" gap="20px" width="50%">
              <Link to="/">
                <Button
                  variant="contained"
                  sx={{
                    color: '#fff',
                    bgcolor: '#782CFF',
                    '&:hover': {
                      color: '#fff',
                      bgcolor: '#782CFF',
                    },
                  }}
                >
                  Trang chủ
                </Button>
              </Link>
              <Link to="tel:+84924212027">
                <Button
                  variant="contained"
                  sx={{
                    color: '#fff',
                    bgcolor: '#782CFF',
                    '&:hover': {
                      color: '#fff',
                      bgcolor: '#782CFF',
                    },
                  }}
                >
                  Gọi hỗ trợ miễn phí
                </Button>
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Error;
