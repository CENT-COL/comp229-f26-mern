import { useCallback, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { AppBar, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import Home from './core/Home.jsx'
// import GreetingForm from './core/GreetingForm.jsx'
import Login from './components/login.jsx'
import Register from './components/register.jsx'
import ProjectList from './components/project-list.jsx'
import ProjectDetails from './components/project-details.jsx'

const MainRouter = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')

  const onAuth = useCallback((value) => {
    if (value) localStorage.setItem('token', value)
    else localStorage.removeItem('token')
    setToken(value)
  }, [])

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography component="span" variant="h6" sx={{ flexGrow: 1 }}>COMP229 MERN</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/projects">Projects</Button>
          {token
            ? <Button color="inherit" onClick={() => onAuth('')}>Sign out</Button>
            : <>
              <Button color="inherit" component={Link} to="/register">Register</Button>
              <Button color="inherit" component={Link} to="/login">Login</Button>
            </>}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ pb: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onAuth={onAuth} />} />
          <Route path="/register" element={<Register onAuth={onAuth} />} />
          <Route path="/projects" element={token
            ? <ProjectList token={token} onAuth={onAuth} />
            : <Navigate to="/login" replace />} />
          <Route path="/project-details" element={token
            ? <ProjectDetails key="create" token={token} onAuth={onAuth} />
            : <Navigate to="/login" replace />} />
          <Route path="/project-details/:id" element={token
            ? <ProjectDetails key="edit" token={token} onAuth={onAuth} />
            : <Navigate to="/login" replace />} />
          {/* <Route path="/practice/:name" element={<GreetingForm />} /> */}
          <Route path="*" element={
            <Stack spacing={2}>
              <Typography component="h1" variant="h4">Page not found</Typography>
              <Button component={Link} to="/">Return home</Button>
            </Stack>
          } />
        </Routes>
      </Container>
    </>
  )
}

export default MainRouter
