import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import Setup2FA from './setup2fa.jsx'

const Login = ({ onAuth }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: password, 2: authenticator code, 3: enroll an existing account.
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const location = useLocation()
  const [notice, setNotice] = useState(location.state?.message || '')
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    onAuth('')
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to login')
      setStep(data.is2FAEnabled ? 2 : 3)
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token: otp }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Invalid authenticator code')
      onAuth(data.token)
      navigate('/projects')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (step === 3) return (
    <Setup2FA credentials={form} onCancel={() => setStep(1)} onComplete={() => {
      setStep(1)
      setNotice('2FA is enabled. Log in with your password and authenticator code.')
    }} />
  )

  return (
    <Card sx={{ maxWidth: 520, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Typography component="h1" variant="h4" align="center" color="primary" gutterBottom>
          {step === 1 ? 'Login' : 'Verify authenticator code'}
        </Typography>
        {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}
        <Stack component="form" spacing={2} onSubmit={step === 1 ? handleSubmit : handleOtpSubmit}>
          {step === 1 ? <>
            <TextField required label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
            <TextField required label="Password" type="password" name="password" value={form.password}
              onChange={handleChange} autoComplete="current-password" />
          </> : <>
            <Typography>Enter the six-digit code from your authenticator app.</Typography>
            <TextField required label="Authenticator code" value={otp} onChange={(event) => setOtp(event.target.value)}
              autoComplete="one-time-code" slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]{6}', maxLength: 6 } }} />
          </>}
          {error && <Alert severity="error">{error}</Alert>}
          <Button disabled={saving} type="submit" variant="contained">
            {saving ? 'Please wait…' : step === 1 ? 'Continue' : 'Verify and log in'}
          </Button>
          {step === 2 && <Button disabled={saving} onClick={() => { setStep(1); setOtp(''); setError('') }}>Back</Button>}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Login
