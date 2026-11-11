import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Setup2FA from './setup2fa.jsx'
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'

const Register = ({ onAuth }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [setup, setSetup] = useState(false)
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
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to register')
      onAuth('')
      setSetup(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (setup) return (
    <Setup2FA credentials={{ email: form.email, password: form.password }}
      onComplete={() => navigate('/login', { state: { message: '2FA is enabled. Log in with your password and authenticator code.' } })}
      onCancel={() => setSetup(false)} />
  )

  return (
    <Card sx={{ maxWidth: 520, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Typography component="h1" variant="h4" align="center" color="primary" gutterBottom>Register</Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField required label="Name" name="name" value={form.name} onChange={handleChange} />
          <TextField required label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
          <TextField required label="Password" type="password" name="password" value={form.password}
            onChange={handleChange} autoComplete="new-password" />
          {error && <Alert severity="error">{error}</Alert>}
          <Button disabled={saving} type="submit" variant="contained">{saving ? 'Please wait…' : 'Register'}</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Register
