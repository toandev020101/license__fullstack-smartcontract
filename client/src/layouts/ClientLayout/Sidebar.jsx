import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { TbLicense } from 'react-icons/tb';
import { RiHistoryFill } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { BiSolidImage } from 'react-icons/bi';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      slug: '/',
      name: 'Quản lý bản quyền',
      icon: <TbLicense />,
    },
    {
      slug: '/lich-su-giao-dich',
      name: 'Lịch sử giao dịch',
      icon: <RiHistoryFill />,
    },
  ];

  return (
    <Box width={'320px'} bgcolor={'#fffffff0'} boxShadow="5px 0 5px -5px rgba(0, 0, 0, 0.05)">
      {/* logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Box display="flex" justifyContent="center" alignItems="center" gap="5px" color={'#782CFF'} padding="20px 0">
          <BiSolidImage fontSize="45px" />
          <Typography variant="h4">ArtChain</Typography>
        </Box>
      </Link>
      {/* logo */}

      <List sx={{ margin: '20px 0' }} disablePadding>
        {navItems.map((nav, index) => (
          <Link to={nav.slug} key={`navItem-${index}`} style={{ textDecoration: 'none' }}>
            <ListItemButton
              sx={{
                marginTop: '10px',
                '&.MuiListItemButton-root': {
                  borderTopRightRadius: '30px',
                  borderBottomRightRadius: '30px',
                  marginRight: '10px',
                  backgroundImage:
                    location.pathname === nav.slug ? `linear-gradient(98deg, #C9ABFF,  #782CFF 94%)` : 'transparent',
                  color: location.pathname === nav.slug ? '#fff' : '#333',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  fontSize: '24px',
                  marginRight: '15px',
                  minWidth: 0,
                  color: location.pathname === nav.slug ? '#fff' : '#444',
                }}
              >
                {nav.icon}
              </ListItemIcon>
              <ListItemText primary={nav.name} sx={{ '& .MuiTypography-root': { fontSize: '16px' } }} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
