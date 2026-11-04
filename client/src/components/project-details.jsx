import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'

const ProjectDetails = ({ token, onAuth }) => {
  const [project, setProject] = useState({ name: '', description: '', startDate: '', endDate: '' })
  const [error, setError] = useState('')
  const { id } = useParams()
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: 'no-store', // Read current data after create/update/delete.
        })
        const data = await response.json()
        if (!response.ok) {
          if (response.status === 401) onAuth('')
          throw new Error(data.message || 'Failed to fetch project')
        }
        if (!data) throw new Error('Project not found')
        setProject({
          name: data.name || '',
          description: data.description || '',
          startDate: data.startDate?.slice(0, 10) || '',
          endDate: data.endDate?.slice(0, 10) || '',
        })
        setLoading(false)
      } catch (error) {
        if (error.name === 'AbortError') return
        setError(error.message)
      }
    }
    fetchProject()
    return () => controller.abort()
  }, [id, token, onAuth])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProject((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const method = id ? 'PUT' : 'POST'
    const url = id ? `/api/projects/${id}` : '/api/projects'
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(project),
      })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) onAuth('')
        throw new Error(data.message || 'Failed to save project')
      }
      navigate('/projects')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Typography component="h1" variant="h4" align="center" color="primary" gutterBottom>
          {id ? 'Update Project' : 'Create Project'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && !error && <Typography role="status">Loading project…</Typography>}
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <TextField required disabled={loading} label="Name" name="name" value={project.name} onChange={handleChange} />
          <TextField required disabled={loading} multiline minRows={3} label="Description" name="description"
            value={project.description} onChange={handleChange} />
          <TextField required disabled={loading} label="Start Date" type="date" name="startDate" value={project.startDate}
            onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField required disabled={loading} label="End Date" type="date" name="endDate" value={project.endDate}
            onChange={handleChange} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: project.startDate } }} />
          <Button type="submit" variant="contained" disabled={saving || loading}>
            {saving ? 'Saving…' : id ? 'Update' : 'Create'}
          </Button>
          <Button onClick={() => navigate('/projects')}>Cancel</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProjectDetails
