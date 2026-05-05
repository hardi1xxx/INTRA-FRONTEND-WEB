import React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/system';

export type VariantColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default';

export interface CustomStatusChipProps {
  label: React.ReactNode;
  variantColor?: VariantColor;
  clickable?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  textColor?: string;
  size?: "small" | "medium"
}

export default function CustomStatusChip({
  label,
  variantColor = 'default',
  clickable = false,
  onClick,
  sx = {},
  textColor,
  size
}: Readonly<CustomStatusChipProps>) {
  const theme = useTheme();

  const convertBG = (variantColor: VariantColor) => {
    switch (variantColor) {
      case 'success':
        return '#E6F4EA';
      case 'info':
        return '#E3E9FF';
      case 'error':
        return '#FDECEA';
      case 'secondary':
        return '#F5F5F5';
      case 'warning':
        return '#FFF9E6';
      default:
        return null;
    }
  }

  // Resolve palette safely; fallback to grey palette
  const paletteColor = (theme.palette as any)[variantColor] ?? theme.palette.grey;
  const background = convertBG(variantColor) ?? (paletteColor?.main ?? theme.palette.grey[300]);
  const contrastText = textColor ?? (paletteColor?.contrastText ?? theme.palette.getContrastText(background));
  const fixTextColor = variantColor == 'secondary' ? '#9E9E9E' : (textColor ?? (convertBG(variantColor) == null ? contrastText : (paletteColor?.main ?? theme.palette.grey[300])))

  return (
    <Box>
      <Chip
        label={label}
        clickable={clickable}
        onClick={onClick}
        size={size}
        sx={{
          justifyContent: 'center',
          px: 1,
          py: 0,
          bgcolor: `${background} !important`,
          color: fixTextColor,
          fontWeight: 'bold',
          fontSize: '12px',
          ...sx,
        }}
      />
    </Box>
  );
}