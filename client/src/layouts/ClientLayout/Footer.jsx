import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box marginLeft="20px" position="absolute" bottom="10px">
      <Typography fontSize="16px" sx={{ color: '#666' }}>
        &copy; 2023 lập trình bởi Nhóm 4: toandev020101, minhtuan12c9, kha1020, QTung
      </Typography>
    </Box>
  );
};

export default Footer;
