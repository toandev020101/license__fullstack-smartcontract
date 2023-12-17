import { Box } from '@mui/material';
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const ClientLayout = ({ children }) => {
  return (
    <>
      <Box minHeight="100vh" bgcolor={'#f5f5f5'} display={'flex'}>
        <Sidebar />

        <Box width={'100%'}>
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
