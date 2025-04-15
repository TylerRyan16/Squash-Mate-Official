import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: "#315fb9",
        },
        secondary: {
            main: "#b5d4f3",
        },
        background: {
            default: "#f8f9fa",
        },
    },
    typography: {
        fontFamily: `'Lato', sans-serif`,
    },
});

export default theme;