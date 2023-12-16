import { Box, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { BiHide, BiShowAlt } from 'react-icons/bi';

const InputField = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, name, label, required, type, fix, ...others } = props;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid, error } }) => (
        <Box position="relative" width="100%">
          <TextField
            onBlur={onBlur} // notify when input is touched
            onChange={onChange}
            name={name}
            label={`${label}${required ? ' *' : ''}`}
            value={value}
            inputRef={ref}
            fullWidth
            {...others}
            error={invalid}
            helperText={error?.message}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            sx={{
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

              '& fieldset, & label.Mui-error, & label': {
                fontSize: '16px',
              },

              '& input': {
                paddingRight: type === 'password' ? '50px' : '0',
              },

              '& p': {
                fontSize: '14px',
              },

              marginBottom: '10px',
            }}
          />

          {type === 'password' && (
            <IconButton
              aria-label="showPassword"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              sx={
                fix
                  ? { position: 'absolute', top: '0', right: '20px' }
                  : { position: 'absolute', top: '13%', right: '20px' }
              }
            >
              {showPassword ? <BiShowAlt /> : <BiHide />}
            </IconButton>
          )}
        </Box>
      )}
    />
  );
};

export default InputField;
