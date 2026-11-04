import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'

const Login = ({ onAuth }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to login')
      onAuth(data.token)
      navigate('/projects')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 520, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Typography component="h1" variant="h4" align="center" color="primary" gutterBottom>Login</Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>

          <TextField required label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
          <TextField required label="Password" type="password" name="password" value={form.password}
            onChange={handleChange} autoComplete="current-password" />
          {error && <Alert severity="error">{error}</Alert>}
          <Button disabled={saving} type="submit" variant="contained">{saving ? 'Please wait…' : 'Login'}</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Login
