import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { BiEdit, BiSearchAlt, BiShowAlt, BiTrashAlt } from 'react-icons/bi';
import { FiPlusSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import TitlePage from '../../../components/TitlePage';

const LicenseManager = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rows = [
    {
      id: 1,
      image: 'long',
      description: '0123456',
      authorName: '10',
      hash: 'sjksdjhfhksjdjfjewiuruweyh',
      createdAt: '14-12-2023',
      //....
    },
  ]; // thêm dữ liệu ở đấy
  const total = rows.length;

  const headCells = [
    // các thành phần trên header
    {
      label: 'ID', // chữ hiển thị
      key: 'id', // key dùng để lấy value
      numeric: false, // là chữ số
      width: 80, // độ rộng của cột
    },
    {
      label: 'Hình ảnh',
      key: 'image',
      numeric: false,
      width: 200,
    },
    {
      label: 'Mô tả',
      key: 'description',
      numeric: false,
      width: 250,
    },
    {
      label: 'Tên tác giả',
      key: 'authorName',
      numeric: false,
      width: 200,
    },
    {
      label: 'Mã băm',
      key: 'hash',
      numeric: false,
      width: 200,
    },
    {
      label: 'Ngày tạo',
      key: 'createdAt',
      numeric: false,
      width: 180,
    },
    {
      label: 'Thao tác',
      numeric: false,
      width: 120,
    },
  ];

  return (
    <Box>
      <TitlePage title="Quản lý bản quyền" />
      {/* list content */}
      <Box
        padding="20px"
        marginBottom="30px"
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
        {/* header list */}
        <Box display="flex" justifyContent="space-between" marginBottom="20px">
          <TextField
            id="outlined-basic"
            label="Tìm kiếm bản quyền"
            variant="outlined"
            size="small"
            sx={{ width: '250px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <BiSearchAlt fontSize="20px" />
                </InputAdornment>
              ),
            }}
          />

          <Link to="/quan-tri/tai-khoan/danh-sach/them-moi">
            <Button
              variant="contained"
              startIcon={<FiPlusSquare />}
              sx={{ color: '#fff', bgcolor: '#782CFF', '&:hover': { bgcolor: '#6511fd' } }}
            >
              Thêm mới
            </Button>
          </Link>
        </Box>
        {/* header list */}

        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 500,
            }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                    sx={{
                      color: '#782CFF',
                      '&.Mui-checked': {
                        color: '#6511fd',
                      },
                    }}
                  />
                </TableCell>

                {headCells.map((headCell, index) => (
                  <TableCell
                    key={`header-cell-${index}`}
                    align={headCell.numeric ? 'right' : 'left'}
                    sx={{ fontSize: '14px' }}
                    width={headCell.width}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      sx={{
                        '&:hover  > div': {
                          opacity: 1,
                          visibility: 'visible',
                        },
                      }}
                    >
                      <Typography fontWeight={500}>{headCell.label}</Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* table content */}
              {rows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow key={`table-${row.id}`} hover role="checkbox" tabIndex={-1}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        sx={{
                          color: '#782CFF',
                          '&.Mui-checked': {
                            color: '#6511fd',
                          },
                        }}
                      />
                    </TableCell>
                    {headCells.map((headCell, idx) => (
                      <>
                        {headCell.key ? (
                          <TableCell key={`rowItem-${idx}`} sx={{ fontSize: '14px' }}>
                            {row[headCell.key] ? row[headCell.key] : '--'}
                          </TableCell>
                        ) : null}
                      </>
                    ))}
                    <TableCell sx={{ fontSize: '14px' }}>
                      <Box display="flex" gap="10px">
                        <Tooltip title="Chi tiết">
                          <IconButton>
                            <BiShowAlt style={{ color: '#40a6ce' }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Sửa">
                          <Link to={`/quan-ly-ban-quyen/chinh-sua/${row.id}`}>
                            <IconButton>
                              <BiEdit style={{ color: '#ffcc00' }} />
                            </IconButton>
                          </Link>
                        </Tooltip>

                        <Tooltip title="Xóa">
                          <IconButton>
                            <BiTrashAlt style={{ color: '#cc3300' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {rows.length === 0 && (
                <TableRow style={{ height: 53 }}>
                  <TableCell colSpan={headCells.length + 1} align="center" sx={{ fontSize: '14px' }}>
                    Không có bản quyền nào!
                  </TableCell>
                </TableRow>
              )}
              {/* table content */}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: total > 0 ? total : -1 }]}
                  colSpan={headCells.length + 1}
                  count={total > 0 ? total : 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'Rows per page:',
                    },
                    native: true,
                  }}
                  labelRowsPerPage="Số hàng trên mỗi trang"
                  labelDisplayedRows={({ from, to }) => `${from}–${to} / ${total}`}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
      {/* list content */}
    </Box>
  );
};

export default LicenseManager;
