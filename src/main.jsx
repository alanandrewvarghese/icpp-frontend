import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#04AA6D', // W3Schools Green
      light: '#33bb87',
      dark: '#037d52',
      contrastText: '#fff',
    },
    secondary: {
      main: '#282A35', // W3Schools Dark Gray
      light: '#3c3f4b',
      dark: '#1b1c24',
      contrastText: '#fff',
    },
    background: {
      default: '#f1f1f1', // W3Schools light gray background
      paper: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
