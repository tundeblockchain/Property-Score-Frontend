import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F766E',
      dark: '#115E59',
      light: '#14B8A6',
      contrastText: '#F8FAFC',
    },
    secondary: {
      main: '#1E293B',
      contrastText: '#F8FAFC',
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    success: {
      main: '#15803D',
    },
    warning: {
      main: '#B45309',
    },
    error: {
      main: '#B91C1C',
    },
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", "Manrope", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.01em',
      lineHeight: 1.15,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", "Manrope", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", "Manrope", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.005em',
      lineHeight: 1.25,
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", "Manrope", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.005em',
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", "Manrope", sans-serif',
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1.35,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", "Manrope", sans-serif',
      fontWeight: 700,
      letterSpacing: 0,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
        },
      },
    },
  },
});
