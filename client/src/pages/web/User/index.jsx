import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Box, Button, Divider, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputField from '../../../components/form/InputField';
import JWTManager from '../../../utils/jwt';
import * as UserApi from '../../../apis/userApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loginSuccess = async () => {
      const userId = JWTManager.getUserId();
      const res = await UserApi.getOneById(userId);
      const user = res.metadata.user;
      setUser(user);
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
                notify: {
                  type: 'error',
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

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar);
      form.reset({
        username: user.username,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        address: user.address,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    generateImageURL(file);
  };

  const generateImageURL = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageURL = event.target.result;
      setAvatar(imageURL);
    };

    reader.readAsDataURL(file);
  };

  const schema = yup.object().shape({
    fullName: yup.string().required('Vui lòng nhập họ và tên !'),
    phoneNumber: yup.string().required('Vui lòng nhập số điện thoại !'),
    address: yup.string().required('Vui lòng nhập địa chỉ !'),
  });

  const form = useForm({
    defaultValues: {
      username: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    for (let key in values) {
      formData.append(key, values[key]);
    }

    try {
      await UserApi.updateOne(formData);
      toast.success('Cập nhật tài khoản thành công!', { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
    } catch (error) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 404) {
        toast.error(data.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${data.code}`);
      }
    }
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
        width: '100%',
        bgcolor: '#fff',
      }}
    >
      {/* Header */}
      <Typography variant="h6">Hồ sơ của tôi</Typography>
      <Typography sx={{ color: '#555', fontSize: '14px' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</Typography>
      {/* Header */}

      <Divider sx={{ margin: '20px 0' }} />

      <Box display={'flex'} sx={{ width: '100%' }}>
        {/* Form */}
        <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)} width={'100%'}>
          <InputField name="username" label="Tên người dùng" size={'small'} form={form} disabled />
          <InputField name="fullName" label="Họ và tên" size={'small'} form={form} required />
          <InputField name="phoneNumber" label="Số điện thoại" size={'small'} form={form} required />
          <InputField name="email" label="Email" size={'small'} form={form} />
          <InputField name="address" label="Địa chỉ" size={'small'} form={form} required />

          <LoadingButton
            loading={isLoading}
            loadingIndicator={'Loading...'}
            variant="contained"
            type="submit"
            sx={{
              textTransform: 'capitalize',
              marginTop: '20px',
              bgcolor: '#782CFF',
              color: '#fff',
              '&:hover': { bgcolor: '#782CFF', color: '#fff' },
            }}
            disabled={isLoading}
          >
            Lưu lại
          </LoadingButton>
        </Box>
        {/* Form */}

        {/* Upload */}
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={'15px'}
          sx={{ marginLeft: '30px', paddingLeft: '30px', borderLeft: '1px solid #e0e0e0', width: '800px' }}
        >
          <Avatar sx={{ width: '130px', height: '130px' }} alt="" src={avatar} />
          <Button component="label" variant="outlined" sx={{ textTransform: 'capitalize' }}>
            Chọn ảnh
            <VisuallyHiddenInput type="file" accept=".jpg, .png" onChange={handleFileChange} />
          </Button>
          <Typography sx={{ color: '#555', fontSize: '15px', textAlign: 'center' }}>
            Dụng lượng file tối đa 1 MB <br /> Định dạng:.JPEG, .PNG
          </Typography>
        </Box>
        {/* Upload */}
      </Box>
    </Box>
  );
};

export default Profile;
