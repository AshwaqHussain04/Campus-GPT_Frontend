import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadDocument } from '../api/client'

export default function AdminUpload() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setStatus(null)
    try {
      const data = await uploadDocument(file)
      setStatus({ ok: true, message: data.message })
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('campusgpt_token')
        navigate('/admin/login')
        return
      }
      setStatus({ ok: false, message: err.response?.data?.detail || 'Upload failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4">Upload Document</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept=".pdf,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !file}>
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {status && (
        <div className={`alert mt-3 ${status.ok ? 'alert-success' : 'alert-danger'}`}>
          {status.message}
        </div>
      )}
    </div>
  )
}