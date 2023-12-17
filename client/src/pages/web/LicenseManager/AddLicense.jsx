import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton, TabContext, TabPanel } from '@mui/lab';
import { Box, Button, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import TitlePage from '../../../components/TitlePage';
import InputField from '../../../components/form/InputField';

const AddLicense = () => {
  const steps = ['Tải lên hình ảnh', 'Thêm thông tin bản quyền', 'Thanh toán', 'Đăng ký bản quyền'];
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [stepActive, setStepActive] = useState(0);
  const [completed, setCompleted] = React.useState({});

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    generateImageURL(file);
  };

  const generateImageURL = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageURL = event.target.result;
      setImg(imageURL);
    };

    reader.readAsDataURL(file);
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return stepActive === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newStepActive =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : stepActive + 1;
    setStepActive(newStepActive);
  };

  const handleBack = () => {
    setStepActive((prevStepActive) => prevStepActive - 1);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[stepActive] = true;
    setCompleted(newCompleted);
    handleNext();
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

  const handleSubmit = async (values) => {};

  return (
    <>
      <TitlePage title="ArtChain - Thêm mới bản quyền" />
      <Box
        padding="20px"
        marginBottom="20px"
        sx={{
          bgcolor: '#fff',
          boxShadow: '#f0f0f0 0px 2px 10px 0px',
          borderRadius: '10px',
          minHeight: '84vh',

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
        }}
      >
        <Stepper sx={{ marginBottom: '20px' }} alternativeLabel activeStep={stepActive}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-alternativeLabel .Mui-active, & .MuiStepLabel-alternativeLabel .Mui-completed':
                    { color: '#782CFF' },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <TabContext value={stepActive.toString()}>
          <TabPanel value="0">
            <Box
              display="flex"
              justifyContent="center"
              flexDirection={'column'}
              alignItems="center"
              color={'#444'}
              width="100%"
              height="100%"
            >
              <Typography sx={{ fontWeight: 600, color: '#868694' }} variant="h4">
                TẢI HÌNH ẢNH LÊN
              </Typography>
              <Typography
                sx={{ marginBottom: '30px', marginTop: '2px', color: '#868694' }}
                variant="h6"
              >
                Hãy chọn hình ảnh mà bạn muốn đăng ký bản quyền
              </Typography>

              {/* upload */}

              {img ? (
                <Box
                  height="450px"
                  width="800px"
                  sx={{
                    border: `2px dashed #c5a4ff`,
                    borderRadius: '15px',
                  }}
                >
                  <img width={'100%'} height={'100%'} src={img} alt="" />
                </Box>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="450px"
                  width="800px"
                  gap="20px"
                  sx={{
                    border: `2px dashed #c5a4ff`,
                    backgroundImage: 'linear-gradient(to bottom, #fdfeff, #eef3fc)',
                    borderRadius: '15px',
                  }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <FaCloudUploadAlt
                    fontSize={'200px'}
                    color="#782cff"
                    style={{ marginTop: '-10px' }}
                  />
                  <Typography sx={{ color: '#868694' }} variant="h5">
                    Kéo & thả hình ảnh ở đây
                  </Typography>
                  <Typography sx={{ color: '#868694' }} variant="h5">
                    Hoặc
                  </Typography>
                  <LoadingButton
                    variant="contained"
                    loading={isLoading}
                    startIcon={<AiOutlineFileAdd />}
                    loadingPosition="start"
                    component="label"
                    sx={{
                      color: '#fff',
                      bgcolor: '#782cff',
                      borderRadius: '10px',
                      fontWeight: 600,
                      '&:hover': { color: '#fff', bgcolor: '#6f1dff' },
                    }}
                  >
                    Chọn tập tin
                    <input hidden onChange={handleFileChange} accept="image/*" type="file" />
                  </LoadingButton>
                </Box>
              )}
              {/* upload */}
            </Box>
          </TabPanel>
          <TabPanel value="1">
            <Box
              display="flex"
              justifyContent="center"
              alignItems={'center'}
              flexDirection={'column'}
              gap={'20px'}
            >
              <Box
                height="350px"
                width="600px"
                sx={{
                  border: `2px dashed #c5a4ff`,
                  borderRadius: '15px',
                }}
              >
                <img width={'100%'} height={'100%'} src={img} alt="" />
              </Box>

              {/* Form */}
              <Box component={'form'} onSubmit={form.handleSubmit(handleSubmit)} width={'1000px'}>
                <InputField name="imageName" label="Tên hình ảnh" size={'small'} form={form} />
                <Box display={'flex'} gap={'20px'}>
                  <Box flex={1}>
                    <InputField
                      name="authorName"
                      label="Tên tác giả"
                      size={'small'}
                      form={form}
                      required
                    />
                    <InputField
                      name="authorPhoneNumber"
                      label="Số điện thoại"
                      size={'small'}
                      form={form}
                      required
                    />
                  </Box>
                  <Box flex={1}>
                    <InputField
                      name="authorEmail"
                      label="Email"
                      size={'small'}
                      form={form}
                      required
                    />
                    <InputField
                      name="authorAddress"
                      label="Địa chỉ"
                      size={'small'}
                      form={form}
                      required
                    />
                  </Box>
                </Box>
              </Box>
              {/* Form */}
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <Box
              display="flex"
              justifyContent="center"
              flexDirection={'column'}
              alignItems="center"
              color={'#444'}
              width="100%"
              height="100%"
            >
              <Typography
                marginBottom={'20px'}
                sx={{ fontWeight: 600, color: '#868694' }}
                variant="h4"
              >
                XÁC NHẬN THANH TOÁN
              </Typography>

              <Box
                height="350px"
                width="700px"
                sx={{
                  border: `2px dashed #c5a4ff`,
                  borderRadius: '15px',
                }}
              >
                <img width={'100%'} height={'100%'} src={img} alt="" />
              </Box>
              <Typography sx={{ marginTop: '20px', color: 'red', fontWeight: 600 }} variant="h4">
                Giá: 0.0000000001 ETH
              </Typography>
              <Typography
                sx={{ marginBottom: '10px', marginTop: '20px', color: '#868694', fontWeight: 600 }}
                variant="h6"
              >
                Bạn chắc chắn muốn đăng ký bản quyền hình ảnh này chứ?
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel value="3">
            <Box
              display="flex"
              justifyContent="center"
              flexDirection={'column'}
              alignItems="center"
              color={'#444'}
              width="100%"
              height="100%"
            >
              <FaCheckCircle
                fontSize={'190px'}
                color="#30c06d"
                style={{ marginBottom: '50px', marginTop: '60px' }}
              />
              <Typography
                marginBottom={'20px'}
                sx={{ fontWeight: 600, color: '#30c06d' }}
                variant="h4"
              >
                ĐĂNG KÝ THÀNH CÔNG
              </Typography>
              <Typography
                sx={{ marginBottom: '30px', marginTop: '20px', color: '#868694', fontWeight: 600 }}
                variant="h6"
              >
                Bản quyền của quý khách đã được đăng ký thành công. ArtChain chúc quý khách tận
                hưởng và vui vẻ!
              </Typography>
            </Box>
          </TabPanel>
        </TabContext>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={'10px'}
          marginTop={'3px'}
        >
          {stepActive === 3 ? (
            <Link to="/">
              <Button
                variant="contained"
                sx={{
                  color: '#fff',
                  bgcolor: '#782cff',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#fff', bgcolor: '#6f1dff' },
                }}
              >
                Quay lại danh sách
              </Button>
            </Link>
          ) : (
            <>
              {stepActive > 0 && (
                <Button
                  variant="contained"
                  sx={{
                    color: '#fff',
                    bgcolor: '#782cff',
                    borderRadius: '10px',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { color: '#fff', bgcolor: '#6f1dff' },
                  }}
                  onClick={handleBack}
                >
                  Quay Lại
                </Button>
              )}
              <Button
                variant="contained"
                sx={{
                  color: '#fff',
                  bgcolor: '#782cff',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#fff', bgcolor: '#6f1dff' },
                }}
                onClick={handleComplete}
              >
                Tiếp Theo
              </Button>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AddLicense;
