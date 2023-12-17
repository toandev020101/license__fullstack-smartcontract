import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiLockAlt, BiLogOut, BiUser, BiWallet } from 'react-icons/bi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import * as AuthApi from '../../apis/authApi';
import * as UserApi from '../../apis/userApi';
import LoadingPage from '../../components/LoadingPage';
import InputField from '../../components/form/InputField';
import JWTManager from '../../utils/jwt';
import Web3Api from '../../web3Api';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectLoading, setIsConnectLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false);

  // menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // menu

  useEffect(() => {
    if (location.state && location.state.notify) {
      const { notify } = location.state;
      toast[notify.type](notify.message, notify.options);

      const newLocationState = { ...location.state };
      delete newLocationState.notify;
      location.state = newLocationState;
    }
  }, [location]);

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

  const handleConnectWallet = async () => {
    setIsConnectLoading(true);
    // Kết nối metamask
    const newWeb3Api = await Web3Api.getInstance();
    let isConnect = await newWeb3Api.connect();
    if (!isConnect) {
      toast.error('Kết nối metamask thất bại!', { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      setIsConnectLoading(false);
      return;
    }

    // Lấy tài khoản hiện tại
    const accounts = await newWeb3Api.web3Instance.eth.getAccounts();
    setAccount(accounts[0]);
    setIsConnectLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    handleClose();

    try {
      await AuthApi.logout();
      JWTManager.deleteToken();
      navigate('/dang-nhap', {
        state: {
          notify: {
            type: 'success',
            message: 'Đăng xuất thành công !',
            options: { theme: 'colored', toastId: 'loginId', autoClose: 1500 },
          },
        },
      });
    } catch (error) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 404) {
        toast.error(data.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${data.code}`);
      }
      setIsLoading(false);
    }
  };

  const handleOpenChangePasswordDialog = () => {
    setOpenChangePasswordDialog(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
  };

  const schema = yup.object().shape({
    password: yup.string().required('Vui lòng nhập mật khẩu cũ !'),
    newPassword: yup.string().required('Vui lòng nhập mật khẩu mới !'),
    confirmNewPassword: yup
      .string()
      .required('Vui lòng nhập xác nhận mật khẩu mới !')
      .oneOf([yup.ref('newPassword')], 'Không khớp mật khẩu!'),
  });

  const form = useForm({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const handleChangePasswordSubmit = async (values) => {
    setIsChangePasswordLoading(true);
    try {
      await UserApi.changePassword(values);
      toast.success('Cập nhật mật khâu thành công!', { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
    } catch (error) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 404) {
        toast.error(data.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${data.code}`);
      }
    }
    setIsChangePasswordLoading(false);
    handleCloseChangePasswordDialog();
  };

  return (
    <Box>
      <ToastContainer />
      {isLoading ? <LoadingPage /> : null}
      <AppBar
        position="static"
        sx={{
          background: 'none',
          boxShadow: 'none',
          color: '#333',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            {account ? (
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderColor: '#782CFF',
                  color: '#782CFF',
                  '&:hover': { borderColor: '#782CFF', color: '#782CFF' },
                }}
              >
                Địa chỉ ví: {account}
              </Button>
            ) : (
              <LoadingButton
                variant="outlined"
                loading={isConnectLoading}
                loadingPosition="start"
                startIcon={<BiWallet />}
                disabled={isLoading}
                sx={{
                  textTransform: 'none',
                  borderColor: '#782CFF',
                  color: '#782CFF',
                  '&:hover': { borderColor: '#782CFF', color: '#782CFF' },
                }}
                onClick={handleConnectWallet}
              >
                Kết nối Metamask
              </LoadingButton>
            )}
          </Box>

          {user && (
            <Box>
              {/* avatar */}
              <Box display={'flex'} alignItems={'center'} gap={'10px'}>
                <Typography>Xin chào, {user?.fullName}</Typography>
                <Tooltip title="Cài đặt tài khoản">
                  <IconButton
                    size="small"
                    aria-controls={openMenu ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} sx={{ width: 45, height: 45 }} />
                    ) : (
                      <Avatar sx={{ width: 45, height: 45 }}>{user?.fullName.charAt(0)}</Avatar>
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={handleClose}
                onClick={handleClose}
                autoFocus={false}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: '200px',
                    bgcolor: '#f9f9f9',
                    color: '#333',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: '#f9f9f9',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => {
                    handleOpenChangePasswordDialog();
                    handleClose();
                  }}
                >
                  <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <BiLockAlt fontSize="20px" style={{ marginRight: '10px' }} />
                    <Typography>Thay đổi mật khẩu</Typography>
                  </Box>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <BiLogOut fontSize="20px" style={{ marginRight: '10px' }} /> Đăng xuất
                </MenuItem>
              </Menu>
              {/* avatar */}
            </Box>
          )}

          <Dialog
            open={openChangePasswordDialog}
            onClose={handleCloseChangePasswordDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Thay đổi mật khẩu</DialogTitle>
            <DialogContent sx={{ width: '500px' }}>
              {/* Form */}
              <Box
                component={'form'}
                onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
                width={'100%'}
                marginTop={'10px'}
              >
                <InputField name="password" label="Mật khẩu cũ" size={'small'} type={'password'} form={form} fix />
                <InputField name="newPassword" label="Mật khẩu mới" size={'small'} type={'password'} form={form} fix />
                <InputField
                  name="confirmNewPassword"
                  label="Xác nhận mật khẩu mới"
                  size={'small'}
                  type={'password'}
                  form={form}
                  fix
                />

                <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} gap={'10px'} marginTop={'20px'}>
                  <LoadingButton
                    loading={isChangePasswordLoading}
                    loadingIndicator={'Loading...'}
                    variant="contained"
                    type="submit"
                    sx={{
                      textTransform: 'capitalize',
                      bgcolor: '#782CFF',
                      color: '#fff',
                      '&:hover': { bgcolor: '#782CFF', color: '#fff' },
                    }}
                    disabled={isChangePasswordLoading}
                  >
                    Xác nhận
                  </LoadingButton>

                  <Button
                    variant={'contained'}
                    color={'error'}
                    onClick={handleCloseChangePasswordDialog}
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    Huỷ
                  </Button>
                </Box>
              </Box>
              {/* Form */}
            </DialogContent>
          </Dialog>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
