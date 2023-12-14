import { Box } from '@mui/material';
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const ClientLayout = ({ children }) => {
  const widthDrawer = '260px';
  return (
    <>
      <Box minHeight="100vh" sx={{ backgroundColor: '#f9f9f9' }}>
        <Sidebar width={widthDrawer} />

        <Box paddingLeft={widthDrawer}>
          <Header />

          {/* content */}
          <Box padding="20px 20px 40px">{children}</Box>
          {/* content */}

          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default ClientLayout;
