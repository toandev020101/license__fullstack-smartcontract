import { Box } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JWTManager from '../../utils/jwt';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../../contexts/authContext';

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogined, _setIsLogined } = useContext(AuthContext);

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
    if (isLogined) {
      navigate('/');
    }
  }, [navigate, isLogined]);

  return (
    <Box position={'relative'}>
      <ToastContainer />
      <Box
        bgcolor={'#f4f5fa'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{ width: '100vw', height: '100vh' }}
      >
        {children}
      </Box>

      <img
        src="/images/auth-v1-mask-light.png"
        alt="mask_light"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100vw' }}
      />
      <img src="/images/auth-v1-tree.png" alt="tree_1" style={{ position: 'absolute', bottom: 0, left: 0 }} />
      <img src="/images/auth-v1-tree-2.png" alt="tree_2" style={{ position: 'absolute', bottom: 0, right: 0 }} />
    </Box>
  );
};

export default AuthLayout;
