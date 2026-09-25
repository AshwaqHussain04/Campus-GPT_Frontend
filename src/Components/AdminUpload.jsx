import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage, uploadDocument } from '../api/client'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const mockDocuments = [
  { name: 'Data Structures.pdf', type: 'PDF', size: '2.4 MB', uploaded: 'Today, 10:15 AM', status: 'Ready for AI' },
  { name: 'DBMS Notes.pdf', type: 'PDF', size: '4.1 MB', uploaded: 'Yesterday, 6:42 PM', status: 'Ready for AI' },
  { name: 'Campus Policies.txt', type: 'TXT', size: '32 KB', uploaded: 'Mon, 9:30 AM', status: 'Processing' },
]

function formatFileSize(bytes) {
  if (!bytes) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

function getFileTypeLabel(fileName) {
  const extension = fileName.split('.').pop()?.toUpperCase() || 'FILE'
  return extension === 'PDF' ? 'PDF' : extension === 'TXT' ? 'TXT' : 'FILE'
}

function resolveUploadError(error) {
  if (error.response?.status === 401) {
    return 'You are not signed in. Please log in again to continue.'
  }
  if (error.response?.status === 403) {
    return 'You do not have permission to upload documents.'
  }
  if (error.response?.status === 400) {
    return 'This file is not supported. Please upload a PDF or TXT file.'
  }
  if (error.response?.status === 413) {
    return 'The selected file is too large. Please choose a smaller document.'
  }
  if (error.response?.status >= 500) {
    return 'The upload service is temporarily unavailable. Please try again in a moment.'
  }
  return getApiErrorMessage(error)
}

function StatusBadge({ status }) {
  const type = status === 'Ready for AI' ? 'ready' : status === 'Processing' ? 'processing' : 'neutral'
  return <span className={`status-badge status-${type}`}>{status}</span>
}

function StatCard({ label, value, note }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  )
}

export default function AdminUpload() {
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [status, setStatus] = useState({ type: 'idle', title: '', message: '' })

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function validateSelectedFile(file) {
    if (!file) return 'Please choose a file to upload.'
    const allowedTypes = ['pdf', 'txt']
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (!allowedTypes.includes(extension)) {
      return 'Unsupported file type. Please upload a PDF or TXT document.'
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'This file is too large. Please upload a document smaller than 10 MB.'
    }

    if (file.size === 0) {
      return 'The selected file is empty. Please choose a document with content.'
    }

    return ''
  }

  function handleFileSelection(fileList) {
    const nextFile = fileList && fileList[0] ? fileList[0] : null
    if (!nextFile) return

    const validationError = validateSelectedFile(nextFile)
    if (validationError) {
      setStatus({ type: 'error', title: 'Upload blocked', message: validationError })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setSelectedFile(nextFile)
    setStatus({ type: 'idle', title: '', message: '' })
  }

  function removeSelectedFile() {
    setSelectedFile(null)
    setStatus({ type: 'idle', title: '', message: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleUpload() {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(12)
    setStatus({ type: 'loading', title: 'Uploading document', message: selectedFile.name })

    try {
      const animation = setInterval(() => {
        setUploadProgress((current) => {
          if (current >= 88) return current
          return current + 12
        })
      }, 180)

      const response = await uploadDocument(selectedFile)
      clearInterval(animation)
      setUploadProgress(100)
      setStatus({
        type: 'success',
        title: 'Document uploaded successfully',
        message: `${selectedFile.name} is now available to Campus-GPT.`,
      })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      const message = resolveUploadError(error)
      if (error.response?.status === 401) {
        localStorage.removeItem('campusgpt_token')
        navigate('/admin/login')
        return
      }
      setStatus({ type: 'error', title: 'Upload failed', message })
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1200)
    }
  }

  return (
    <main className="container admin-upload-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h1>Document Management</h1>
          <p className="page-subtitle">
            Upload official knowledge sources so Campus-GPT can answer questions with the latest campus information.
          </p>
        </div>
      </div>

      <div className="stats-grid" aria-label="Document overview">
        <StatCard label="Documents" value="12" note="Mock data" />
        <StatCard label="Ready" value="10" note="Indexed" />
        <StatCard label="Processing" value="2" note="In queue" />
        <StatCard label="Storage" value="48 MB" note="Mock data" />
      </div>

      <div className="dashboard-grid">
        <section className="panel upload-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Upload</p>
              <h2>Knowledge sources</h2>
            </div>
          </div>

          {!selectedFile ? (
            <div
              className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragActive(true)
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(event) => {
                event.preventDefault()
                setIsDragActive(false)
                handleFileSelection(event.dataTransfer.files)
              }}
              onClick={openFilePicker}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openFilePicker()
                }
              }}
              aria-label="Upload a PDF or TXT file"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                hidden
                onChange={(event) => handleFileSelection(event.target.files)}
              />

              <div className="dropzone-icon" aria-hidden="true">⇪</div>
              <h3>Drop PDF or TXT files here</h3>
              <p>or</p>
              <button type="button" className="campus-btn campus-btn-primary dropzone-button">
                Browse Files
              </button>
              <div className="dropzone-meta">
                <span>Supported formats: PDF, TXT</span>
                <span>Maximum size: 10 MB</span>
              </div>
            </div>
          ) : (
            <div className="selected-file-card">
              <div className="file-card-header">
                <div className="file-icon" aria-hidden="true">PDF</div>
                <div className="file-meta">
                  <strong>{selectedFile.name}</strong>
                  <span>
                    {getFileTypeLabel(selectedFile.name)} • {formatFileSize(selectedFile.size)}
                  </span>
                </div>
              </div>

              <div className="file-status-row">
                <span className="status-pill status-neutral">Ready to upload</span>
              </div>

              {isUploading && (
                <div className="upload-progress-wrapper" aria-live="polite">
                  <div className="upload-progress-label">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="upload-progress-bar">
                    <span style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="file-actions">
                <button type="button" className="campus-btn campus-btn-secondary" onClick={removeSelectedFile}>
                  Remove
                </button>
                <button type="button" className="campus-btn campus-btn-primary" onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload document'}
                </button>
              </div>
            </div>
          )}

          {status.type !== 'idle' && (
            <div className={`status-banner status-${status.type}`} aria-live="polite">
              <strong>{status.title}</strong>
              <span>{status.message}</span>
            </div>
          )}
        </section>

        <aside className="panel info-panel">
          <div className="panel-header compact">
            <div>
              <p className="panel-kicker">How it works</p>
              <h2>Document knowledge</h2>
            </div>
          </div>

          <ol className="help-steps">
            <li>Upload an official document</li>
            <li>Campus-GPT processes the content</li>
            <li>The document is indexed for retrieval</li>
            <li>Students can ask questions about it</li>
          </ol>

          <div className="helper-box">
            <h3>Recommended documents</h3>
            <ul>
              <li>Course notes</li>
              <li>Syllabus and regulations</li>
              <li>Department information</li>
              <li>Campus policies</li>
            </ul>
          </div>
        </aside>
      </div>

      <section className="panel library-panel">
        <div className="panel-header library-header">
          <div>
            <p className="panel-kicker">Library</p>
            <h2>Recently uploaded documents</h2>
          </div>
          <div className="library-toolbar">
            <input type="search" placeholder="Search documents" aria-label="Search documents" />
            <button type="button" className="campus-btn campus-btn-secondary">Filter</button>
          </div>
        </div>

        <div className="document-table-wrap">
          <table className="document-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockDocuments.map((entry) => (
                <tr key={entry.name}>
                  <td className="document-name-cell">
                    <span className="inline-doc-icon" aria-hidden="true">{entry.type === 'PDF' ? 'PDF' : 'TXT'}</span>
                    {entry.name}
                  </td>
                  <td>{entry.type}</td>
                  <td>{entry.size}</td>
                  <td>{entry.uploaded}</td>
                  <td><StatusBadge status={entry.status} /></td>
                  <td>
                    <button type="button" className="text-action">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}