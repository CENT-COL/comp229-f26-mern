import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert, Button, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography,
} from '@mui/material'

const ProjectList = ({ token, onAuth }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: 'no-store', // Read current data after create/update/delete.
        })
        const data = await response.json()
        if (!response.ok) {
          if (response.status === 401) onAuth('')
          throw new Error(data.message || 'Failed to fetch projects')
        }
        setProjects(data)
        setLoading(false)
      } catch (error) {
        if (error.name === 'AbortError') return
        setError(error.message)
        setLoading(false)
      }
    }
    fetchProjects()
    return () => controller.abort()
  }, [token, onAuth])

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"?`)) return
    setDeleting(true)
    setError('')
    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) onAuth('')
        throw new Error(data.message || 'Failed to delete project')
      }
      setProjects((previous) => previous.filter((item) => item._id !== project._id))
    } catch (error) {
      setError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Stack spacing={3} sx={{ mt: 5 }}>
      <Typography component="h1" variant="h4" align="center" color="primary">Projects</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Button variant="contained" sx={{ alignSelf: 'flex-start' }}
        onClick={() => navigate('/project-details')}>Create New Project</Button>
      <TableContainer>
        <Table aria-label="Projects">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5}>Loading projects…</TableCell></TableRow>
              : projects.length === 0 ? <TableRow><TableCell colSpan={5}>No projects available</TableCell></TableRow>
              : projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell component="th" scope="row">{project.name}</TableCell>
                  <TableCell sx={{ overflowWrap: 'anywhere' }}>{project.description}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{project.startDate?.slice(0, 10)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{project.endDate?.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button onClick={() => navigate(`/project-details/${project._id}`)}>Update</Button>
                      <Button color="error" disabled={deleting} onClick={() => handleDelete(project)}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default ProjectList
