import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
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
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { BiEdit, BiSearchAlt, BiShowAlt, BiTrashAlt } from 'react-icons/bi';
import { FiPlusSquare } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import TitlePage from '../../../components/TitlePage';
import { AuthContext } from '../../../contexts/authContext';
import { WalletContext } from '../../../contexts/walletContext';
import { toast } from 'react-toastify';
import * as LicenseApi from '../../../apis/licenseApi';
import Web3Api from '../../../web3Api';

const LicenseManager = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedArr, setSelectedArr] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const { isLogined, _setIsLogined } = useContext(AuthContext);
  const { isConnected, _setIsConnected } = useContext(WalletContext);

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
      width: 150,
    },
    {
      label: 'Tên hình ảnh',
      key: 'imageName',
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
    },
    {
      label: 'Thao tác',
      numeric: false,
      width: 120,
    },
  ];

  useEffect(() => {
    // bỏ chọn nếu lấy lại danh sách rows
    setSelectedArr([]);

    const getPaginationLicense = async () => {
      setIsLoading(true);
      try {
        const res = await LicenseApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          searchTerm,
        });

        const { licenses, total } = res.metadata;
        let newRows = licenses;

        // lấy hash
        const newWeb3Api = await Web3Api.getInstance();
        if (newWeb3Api.contractInstance) {
          const ids = licenses.map((license) => license.id);
          const licenseArr = await newWeb3Api.contractInstance.methods.getLicenses(ids).call();
          newRows = licenses.map((license, index) => {
            return { ...license, hash: licenseArr[index].hash };
          });
        }

        if (newRows.length === 0 && page > 0) {
          setPage((prevPage) => prevPage - 1);
        }
        setRows(newRows);
        setTotal(total);
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

    if (isLogined) {
      getPaginationLicense();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, reload, isLogined, isConnected]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedArr = rows.map((row) => row.id);
      setSelectedArr(newSelectedArr);
      return;
    }
    setSelectedArr([]);
  };

  const handleRowClick = (_event, id) => {
    const selectedIndex = selectedArr.indexOf(id);
    let newSelectedArr = [];

    if (selectedIndex === -1) {
      newSelectedArr = newSelectedArr.concat(selectedArr, id);
    } else if (selectedIndex === 0) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(1));
    } else if (selectedIndex === selectedArr.length - 1) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedArr = newSelectedArr.concat(
        selectedArr.slice(0, selectedIndex),
        selectedArr.slice(selectedIndex + 1),
      );
    }
    setSelectedArr(newSelectedArr);
  };

  const isSelected = (id) => selectedArr.indexOf(id) !== -1;

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteRowIndex = (index) => {
    setDeleteRowIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteRow = async () => {
    setIsDeleteLoading(true);
    try {
      if (deleteRowIndex === -1) {
        const success = await LicenseApi.removeAny({ ids: selectedArr });
        if (success) {
          const newWeb3Api = await Web3Api.getInstance();
          if (newWeb3Api.contractInstance) {
            const accounts = await newWeb3Api.web3Instance.eth.getAccounts();
            await newWeb3Api.contractInstance.methods
              .removeLicenses(selectedArr)
              .send({ from: accounts[0] });
          }
        }
      } else {
        const success = await LicenseApi.removeOne(rows[deleteRowIndex].id);
        if (success) {
          const newWeb3Api = await Web3Api.getInstance();
          if (newWeb3Api.contractInstance) {
            const accounts = await newWeb3Api.web3Instance.eth.getAccounts();
            await newWeb3Api.contractInstance.methods
              .removeLicense(rows[deleteRowIndex].id)
              .send({ from: accounts[0] });
          }
        }
      }

      toast.success('Xoá bản quyền thành công!', {
        theme: 'colored',
        toastId: 'headerId',
        autoClose: 1500,
      });

      setReload(!reload);
      setSelectedArr([]);
    } catch (error) {
      const { data } = error.response;
      if (data.code === 400 || data.code === 404) {
        toast.error(data.message, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else if (data.code === 500) {
        navigate('/error/500');
      }
    }
    setIsDeleteLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setTimeout(() => {
      setReload(!reload);
      setPage(0);
    }, 500);
  };

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
          <Box display="flex" alignItems={'center'} gap={'10px'}>
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
              value={searchTerm}
              onChange={handleSearchChange}
            />

            {selectedArr.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<BiTrashAlt />}
                sx={{
                  textTransform: 'capitalize',
                }}
                onClick={() => handleDeleteRowIndex(-1)}
              >
                Xóa ({selectedArr.length})
              </Button>
            )}
          </Box>

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
                    indeterminate={selectedArr.length > 0 && selectedArr.length < rows.length}
                    checked={rows.length > 0 && selectedArr.length === rows.length}
                    onChange={handleSelectAllClick}
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

                {headCells.map((headCell, id) => (
                  <TableCell
                    key={`header-cell-item-${id}`}
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
              {isLoading ? (
                <>
                  {Array(rowsPerPage)
                    .fill(0)
                    .map((_row, idx) => (
                      <TableRow key={`table-${idx}`}>
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Skeleton variant="rounded" animation="wave" width="18px" height="18px">
                            <Checkbox />
                          </Skeleton>
                        </TableCell>

                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>Mã đơn hàng</Typography>
                          </Skeleton>
                        </TableCell>

                        {headCells.map((headCell, i) => (
                          <Fragment key={`loading-item-${i}`}>
                            {headCell.key && headCell.key !== 'image' ? (
                              <TableCell>
                                <Skeleton animation="wave" width="100%">
                                  <Typography>{headCell.label}</Typography>
                                </Skeleton>
                              </TableCell>
                            ) : null}
                          </Fragment>
                        ))}

                        <TableCell>
                          <Box display="flex" gap="10px">
                            <Skeleton animation="wave" variant="circular">
                              <IconButton>
                                <BiShowAlt />
                              </IconButton>
                            </Skeleton>

                            <Skeleton animation="wave" variant="circular">
                              <IconButton>
                                <BiEdit />
                              </IconButton>
                            </Skeleton>

                            <Skeleton animation="wave" variant="circular">
                              <IconButton>
                                <BiTrashAlt />
                              </IconButton>
                            </Skeleton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ) : (
                <>
                  {/* table content */}
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        key={`table-${row.id}`}
                        onClick={(event) => handleRowClick(event, row.id)}
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        tabIndex={-1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
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
                            {headCell.key &&
                              (headCell.key !== 'image' ? (
                                <TableCell key={`rowItem-${idx}`} sx={{ fontSize: '14px' }}>
                                  {row[headCell.key] ? row[headCell.key] : '--'}
                                </TableCell>
                              ) : (
                                <TableCell key={`rowItem-${idx}`} sx={{ fontSize: '14px' }}>
                                  <img width={'60px'} src={row[headCell.key]} alt="" />
                                </TableCell>
                              ))}
                          </>
                        ))}
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box display="flex" gap="10px">
                            <Tooltip title="Chi tiết">
                              <Link to={`/quan-ly-ban-quyen/${row.id}`}>
                                <IconButton>
                                  <BiShowAlt style={{ color: '#40a6ce' }} />
                                </IconButton>
                              </Link>
                            </Tooltip>

                            <Tooltip title="Sửa">
                              <Link to={`/quan-ly-ban-quyen/chinh-sua/${row.id}`}>
                                <IconButton>
                                  <BiEdit style={{ color: '#ffcc00' }} />
                                </IconButton>
                              </Link>
                            </Tooltip>

                            <Tooltip title="Xóa">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRowIndex(index);
                                }}
                              >
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
                      <TableCell
                        colSpan={headCells.length + 1}
                        align="center"
                        sx={{ fontSize: '14px' }}
                      >
                        Không có bản quyền nào!
                      </TableCell>
                    </TableRow>
                  )}
                  {/* table content */}
                </>
              )}
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
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
            Xác nhận xóa bản quyền
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
              Bạn chắc chắn muốn xóa{' '}
              {deleteRowIndex === -1
                ? selectedArr.length + ' bản quyền này'
                : `bản quyền "#${rows[deleteRowIndex]?.id}"`}{' '}
              hay không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={isDeleteLoading}
              loadingIndicator={'Loading...'}
              variant="contained"
              type="submit"
              sx={{
                textTransform: 'capitalize',
                bgcolor: '#782CFF',
                color: '#fff',
                '&:hover': { bgcolor: '#782CFF', color: '#fff' },
              }}
              disabled={isDeleteLoading}
              onClick={() => {
                handleDeleteDialogClose();
                handleDeleteRow();
              }}
            >
              Xác nhận
            </LoadingButton>

            <Button
              variant={'contained'}
              color={'error'}
              onClick={handleDeleteDialogClose}
              sx={{
                textTransform: 'capitalize',
              }}
            >
              Huỷ
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* list content */}
    </Box>
  );
};

export default LicenseManager;
