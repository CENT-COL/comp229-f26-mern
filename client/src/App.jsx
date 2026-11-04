import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.js'
import MainRouter from './MainRouter.jsx';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  </ThemeProvider>
);

export default App
