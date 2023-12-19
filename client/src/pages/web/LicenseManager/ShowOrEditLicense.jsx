import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import InputField from '../../../components/form/InputField';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

const ShowOrEditLicense = () => {
  const schema = yup.object().shape({
    imageName: yup.string().required('Vui lòng nhập tên hình ảnh !'),
    authorName: yup.string().required('Vui lòng nhập tên tác giả !'),
    authorPhoneNumber: yup.string().required('Vui lòng nhập số điện thoại !'),
    authorEmail: yup.string().required('Vui lòng nhập email !'),
    authorAddress: yup.string().required('Vui lòng nhập địa chỉ !'),
  });

  const form = useForm({
    defaultValues: {
      imageName: '',
      authorName: '',
      authorPhoneNumber: '',
      authorEmail: '',
      authorAddress: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (values) => {
    console.log(values);
  };

  return (
    <Box
      padding="20px"
      marginBottom="30px"
      display="flex"
      justifyContent="center"
      alignItems={'center'}
      flexDirection={'column'}
      gap={'30px'}
      sx={{
        bgcolor: '#fff',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 3px',
        borderRadius: '5px',

        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: '#782CFF',
            fontSize: '16px',
          },
        },
        '& label.Mui-focused': {
          color: '#782CFF',
          fontSize: '16px',
        },

        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#782CFF',
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#782CFF',
        },
      }}
    >
      <Typography variant="h4" sx={{ textTransform: 'uppercase', fontWeight: 600, color: '#555' }}>
        Chỉnh sửa thông tin bản quyền
      </Typography>
      <Box
        height="350px"
        width="600px"
        sx={{
          border: `2px dashed #c5a4ff`,
          borderRadius: '15px',
        }}
      >
        <img width={'100%'} height={'100%'} src="" alt="" />
      </Box>

      {/* Form */}
      <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)} width={'1000px'}>
        <InputField name="imageName" label="Tên hình ảnh" size={'small'} form={form} required />
        <Box display={'flex'} gap={'20px'}>
          <Box flex={1}>
            <InputField name="authorName" label="Tên tác giả" size={'small'} form={form} required />
            <InputField
              name="authorPhoneNumber"
              label="Số điện thoại"
              size={'small'}
              form={form}
              required
            />
          </Box>
          <Box flex={1}>
            <InputField name="authorEmail" label="Email" size={'small'} form={form} required />
            <InputField name="authorAddress" label="Địa chỉ" size={'small'} form={form} required />
          </Box>
        </Box>
        <Box display={'flex'} gap={'10px'} justifyContent={'center'} marginTop={'20px'}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '10px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { color: '#fff', bgcolor: '#6f1dff' },
            }}
          >
            Quay lại
          </Button>
          <LoadingButton
            variant="contained"
            loading={false}
            loadingIndicator="Loading..."
            sx={{
              color: '#fff',
              bgcolor: '#782cff',
              borderRadius: '10px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { color: '#fff', bgcolor: '#6f1dff' },
            }}
            type={'submit'}
          >
            Lưu lại
          </LoadingButton>
        </Box>
      </Box>
      {/* Form */}
    </Box>
  );
};

export default ShowOrEditLicense;
