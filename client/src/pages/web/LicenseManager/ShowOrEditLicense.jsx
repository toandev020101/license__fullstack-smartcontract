import { Box, Button, Typography, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InputField from '../../../components/form/InputField';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import * as LicenseApi from '../../../apis/licenseApi';
import { toast } from 'react-toastify';
import LoadingPage from '../../../components/LoadingPage';
import Web3Api from '../../../web3Api';

const ShowOrEditLicense = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState('edit');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [license, setLicense] = useState(null);
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (!location.pathname.includes('chinh-sua')) {
      setType('show');
    }
  }, [location]);

  useEffect(() => {
    const getLicense = async () => {
      setIsLoading(true);
      try {
        const res = await LicenseApi.getOneById(id);
        const newLicense = res.metadata.license;
        setLicense(newLicense);
        form.reset({
          imageName: newLicense.imageName,
          authorName: newLicense.authorName,
          authorPhoneNumber: newLicense.authorPhoneNumber,
          authorEmail: newLicense.authorEmail,
          authorAddress: newLicense.authorAddress,
        });
      } catch (error) {
        const { data } = error.response;
        if (data.code === 400 || data.code === 404) {
          toast.error(data.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else if (data.code === 500) {
          navigate('/error/500');
        }
      }
      setIsLoading(false);
    };

    if (id) {
      getLicense();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  useEffect(() => {
    const getHash = async () => {
      setIsLoading(true);
      try {
        // lấy hash
        const newWeb3Api = await Web3Api.getInstance();
        if (newWeb3Api.contractInstance) {
          const newLicense = await newWeb3Api.contractInstance.methods.getLicense(id).call();
          setHash(newLicense.hash);
        }
      } catch (error) {
        toast.error(error.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      }
      setIsLoading(false);
    };

    if (id && type !== 'edit') {
      getHash();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

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
    setIsEditLoading(true);
    try {
      const res = await LicenseApi.updateOne({ id, ...values });
      const newWeb3Api = await Web3Api.getInstance();
      if (newWeb3Api.contractInstance) {
        const accounts = await newWeb3Api.web3Instance.eth.getAccounts();
        await newWeb3Api.contractInstance.methods
          .updateLicense(res.metadata.id, res.metadata.hash)
          .send({ from: accounts[0] });

        navigate('/', {
          state: {
            notify: {
              type: 'success',
              message: 'Chỉnh sửa bản quyền thành công',
              options: { theme: 'colored', toastId: 'headerId', autoClose: 1500 },
            },
          },
        });
      }
    } catch (error) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 404) {
        toast.error(data.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else if (data.code === 500) {
        navigate('/error/500');
      }
    }
    setIsEditLoading(false);
  };

  return (
    <Box>
      {isLoading && <LoadingPage />}
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
        <Typography
          variant="h5"
          sx={{ textTransform: 'uppercase', fontWeight: 600, color: '#555' }}
        >
          {type === 'edit' ? 'Chỉnh sửa thông tin bản quyền' : 'Thông tin chi tiết bản quyền'}
        </Typography>
        <Box
          height="240px"
          width="440px"
          sx={{
            border: `2px dashed #c5a4ff`,
            borderRadius: '15px',
          }}
        >
          <img width={'100%'} height={'100%'} src={license?.image} alt="" />
        </Box>

        {/* Form */}
        <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)} width={'1000px'}>
          <InputField
            name="imageName"
            label="Tên hình ảnh"
            size={'small'}
            form={form}
            required
            readonly={type !== 'edit'}
          />
          <Box display={'flex'} gap={'20px'}>
            <Box flex={1}>
              <InputField
                name="authorName"
                label="Tên tác giả"
                size={'small'}
                form={form}
                required
                readonly={type !== 'edit'}
              />
              <InputField
                name="authorPhoneNumber"
                label="Số điện thoại"
                size={'small'}
                form={form}
                required
                readonly={type !== 'edit'}
              />
              {type !== 'edit' && (
                <TextField
                  name="Price"
                  label="Giá"
                  value={license?.price}
                  size={'small'}
                  InputProps={{
                    readOnly: true,
                  }}
                  required
                  fullWidth
                />
              )}
            </Box>
            <Box flex={1}>
              <InputField
                name="authorEmail"
                label="Email"
                size={'small'}
                form={form}
                required
                readonly={type !== 'edit'}
              />
              <InputField
                name="authorAddress"
                label="Địa chỉ"
                size={'small'}
                form={form}
                required
                readonly={type !== 'edit'}
              />
              {type !== 'edit' && (
                <TextField
                  name="Hash"
                  label="Mã băm"
                  value={hash}
                  size={'small'}
                  InputProps={{
                    readOnly: true,
                  }}
                  required
                  fullWidth
                />
              )}
            </Box>
          </Box>
          <Box display={'flex'} gap={'10px'} justifyContent={'center'} marginTop={'20px'}>
            <Link to="/">
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '10px',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Quay lại
              </Button>
            </Link>
            {type === 'edit' && (
              <LoadingButton
                variant="contained"
                loading={isEditLoading}
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
            )}
          </Box>
        </Box>
        {/* Form */}
      </Box>
    </Box>
  );
};

export default ShowOrEditLicense;
