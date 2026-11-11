import { useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'

const Setup2FA = ({ credentials, onComplete, onCancel }) => {
  const [qrCode, setQrCode] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const setup2FA = async () => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/users/setup-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not generate QR code')
      setQrCode(data.imageUrl)
      setOtp('')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const verify2FASetup = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/users/verify-2fa-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, token: otp }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Invalid authenticator code')
      onComplete()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 520, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography component="h1" variant="h4" color="primary">Set up 2FA</Typography>
          <Typography>Generate a QR code and scan it with your authenticator app.</Typography>
          <Button disabled={saving} variant="outlined" onClick={setup2FA}>
            {qrCode ? 'Generate a new QR code' : 'Generate QR code'}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {qrCode && (
            <Stack component="form" spacing={2} onSubmit={verify2FASetup}>
              <Box component="img" src={qrCode} alt="Authenticator setup QR code"
                sx={{ width: 240, maxWidth: '100%', alignSelf: 'center' }} />
              <Typography>Enter the six-digit code shown in the app to finish setup.</Typography>
              <TextField required label="Authenticator code" value={otp} onChange={(event) => setOtp(event.target.value)}
                autoComplete="one-time-code" slotProps={{ htmlInput: { inputMode: 'numeric', pattern: '[0-9]{6}', maxLength: 6 } }} />
              <Button disabled={saving} type="submit" variant="contained">Verify setup</Button>
            </Stack>
          )}
          <Button disabled={saving} onClick={onCancel}>Back</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Setup2FA
