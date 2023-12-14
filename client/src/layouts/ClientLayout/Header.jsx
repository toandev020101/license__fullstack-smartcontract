import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import JWTManager from '../../utils/jwt';
import { ToastContainer, toast } from 'react-toastify';
import * as UserApi from '../../apis/userApi';
import { BiLockAlt, BiLogOut, BiUser, BiWallet } from 'react-icons/bi';
import LoadingButton from '@mui/lab/LoadingButton';
import LoadingPage from '../../components/LoadingPage';
import Web3Api from '../../web3Api';
import * as AuthApi from '../../apis/authApi';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectLoading, setIsConnectLoading] = useState(false);
  const [account, setAccount] = useState(null);

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
      delete location.state.notify;
    }
  }, [location]);

  useEffect(() => {
    const loginSuccess = async () => {
      const userId = JWTManager.getUserId();
      const res = await UserApi.getOneById(userId);
      const user = res.metadata.user;
      setUser(user);
      toast.success('Xin chào, ' + user.fullName, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
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
                <MenuItem onClick={handleClose}>
                  <Link
                    to="/tai-khoan/ho-so"
                    style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}
                  >
                    <BiUser fontSize="20px" style={{ marginRight: '10px' }} /> Thông tin tài khoản
                  </Link>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                  <Link
                    to="/tai-khoan/thay-doi-mat-khau"
                    style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}
                  >
                    <BiLockAlt fontSize="20px" style={{ marginRight: '10px' }} /> Thay đổi mật khẩu
                  </Link>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <BiLogOut fontSize="20px" style={{ marginRight: '10px' }} /> Đăng xuất
                </MenuItem>
              </Menu>
              {/* avatar */}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
