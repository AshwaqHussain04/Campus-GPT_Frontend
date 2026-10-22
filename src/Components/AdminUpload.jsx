import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteAdminDocument, getAdminDocuments, getApiErrorMessage, logoutUser, uploadDocument } from '../api/client'
import { LoadingSpinner } from './LoadingSpinner'

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

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
  return extension === 'PDF' || extension === 'TXT' ? extension : 'FILE'
}

function resolveUploadError(error) {
  if (error.response?.status === 401) return 'You are not signed in. Please log in again to continue.'
  if (error.response?.status === 403) return 'You do not have permission to upload documents.'
  if (error.response?.status === 400) return 'This file is not supported. Please upload a PDF or TXT file.'
  if (error.response?.status === 422 && typeof error.response.data?.detail === 'string') return error.response.data.detail
  if (error.response?.status === 413) return 'The selected file is too large. The maximum size is 20 MB.'
  if (error.response?.status >= 500) return 'The upload service is temporarily unavailable. Please try again in a moment.'
  return getApiErrorMessage(error)
}

function StatusBadge({ status }) {
  const type = status === 'ready' ? 'ready' : status === 'not_indexed' ? 'processing' : 'neutral'
  const label = status === 'ready' ? 'Ready for AI' : status === 'not_indexed' ? 'Not indexed' : status
  return <span className={`status-badge status-${type}`}>{label}</span>
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
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(true)
  const [libraryError, setLibraryError] = useState('')
  const [deletingDocumentId, setDeletingDocumentId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [status, setStatus] = useState({ type: 'idle', title: '', message: '' })

  const filteredDocuments = useMemo(() => uploadedDocuments.filter((document) => {
    const matchesSearch = document.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || document.type === filter || document.status === filter
    return matchesSearch && matchesFilter
  }), [filter, searchTerm, uploadedDocuments])

  async function refreshDocuments() {
    setLibraryError('')
    try {
      const data = await getAdminDocuments()
      setUploadedDocuments(data.documents || [])
      setStats(data.stats || null)
    } catch (error) {
      if (error.response?.status === 401) {
        logoutUser()
        navigate('/admin/login')
        return
      }
      setLibraryError('Could not load the document library. Please try again.')
    } finally {
      setIsLoadingLibrary(false)
    }
  }

  useEffect(() => {
    refreshDocuments()
  }, [])

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function validateSelectedFile(file) {
    if (!file) return 'Please choose a file to upload.'
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'txt'].includes(extension)) return 'Unsupported file type. Please upload a PDF or TXT document.'
    if (file.size > MAX_FILE_SIZE_BYTES) return 'This file is too large. Please upload a document no larger than 20 MB.'
    if (file.size === 0) return 'The selected file is empty. Please choose a document with content.'
    return ''
  }

  function handleFileSelection(fileList) {
    const nextFile = fileList?.[0]
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

    const fileBeingUploaded = selectedFile
    setIsUploading(true)
    setUploadProgress(12)
    setStatus({ type: 'loading', title: 'Uploading document', message: fileBeingUploaded.name })
    const animation = setInterval(() => {
      setUploadProgress((current) => current >= 88 ? current : current + 12)
    }, 180)

    try {
      const response = await uploadDocument(fileBeingUploaded)
      setUploadProgress(100)
      const isReady = response.chunks_ingested === true
      await refreshDocuments()
      setStatus({
        type: 'success',
        title: isReady ? 'Document ready for Campus-GPT' : 'Document uploaded',
        message: response.message || `${fileBeingUploaded.name} was uploaded successfully.`,
      })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('campusgpt_token')
        navigate('/admin/login')
        return
      }
      setStatus({ type: 'error', title: 'Upload failed', message: resolveUploadError(error) })
    } finally {
      clearInterval(animation)
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1200)
    }
  }

  async function handleDelete(document) {
    const confirmed = window.confirm(`Delete ${document.filename}? It will no longer be available as a Campus-GPT knowledge source.`)
    if (!confirmed) return

    setDeletingDocumentId(document.document_id)
    setStatus({ type: 'idle', title: '', message: '' })
    try {
      await deleteAdminDocument(document.document_id)
      await refreshDocuments()
      setStatus({ type: 'success', title: 'Document deleted', message: `${document.filename} was removed from campus knowledge.` })
    } catch (error) {
      if (error.response?.status === 401) {
        logoutUser()
        navigate('/admin/login')
        return
      }
      setStatus({ type: 'error', title: 'Delete failed', message: error.response?.data?.detail || 'The document could not be deleted. Please try again.' })
    } finally {
      setDeletingDocumentId('')
    }
  }

  return (
    <main className="container admin-upload-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h1>Document Management</h1>
          <p className="page-subtitle">Manage the official knowledge sources used by Campus-GPT.</p>
        </div>
      </div>

      <div className="stats-grid" aria-label="Document overview">
        <StatCard label="Documents" value={stats?.total_documents ?? '—'} note="In the knowledge directory" />
        <StatCard label="Ready" value={stats?.ready_documents ?? '—'} note="Indexed and searchable" />
        <StatCard label="Not indexed" value={stats?.not_indexed_documents ?? '—'} note="Needs processing" />
        <StatCard label="Storage" value={stats ? formatFileSize(stats.total_size_bytes) : '—'} note="Current document files" />
      </div>

      <div className="dashboard-grid">
        <section className="panel upload-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Upload</p>
              <h2>Knowledge sources</h2>
            </div>
            <span className="upload-flow-label">Upload → Process → Ready</span>
          </div>

          {!selectedFile ? (
            <div
              className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
              onDragOver={(event) => { event.preventDefault(); setIsDragActive(true) }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(event) => { event.preventDefault(); setIsDragActive(false); handleFileSelection(event.dataTransfer.files) }}
              onClick={openFilePicker}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openFilePicker() } }}
              aria-label="Upload a PDF or TXT file"
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.txt" hidden onChange={(event) => handleFileSelection(event.target.files)} />
              <div className="dropzone-icon" aria-hidden="true">⇪</div>
              <h3>Drop PDF or TXT files here</h3>
              <p>or</p>
              <button type="button" className="campus-btn campus-btn-primary dropzone-button">Browse files</button>
              <div className="dropzone-meta"><span>Supported formats: PDF, TXT</span><span>Maximum size: 20 MB</span></div>
            </div>
          ) : (
            <div className="selected-file-card">
              <div className="file-card-header">
                <div className="file-icon" aria-hidden="true">{getFileTypeLabel(selectedFile.name)}</div>
                <div className="file-meta"><strong>{selectedFile.name}</strong><span>{getFileTypeLabel(selectedFile.name)} · {formatFileSize(selectedFile.size)}</span></div>
              </div>
              <div className="file-status-row"><span className="status-pill status-neutral">Ready to upload</span></div>
              {isUploading && (
                <div className="upload-progress-wrapper" aria-live="polite">
                  <div className="upload-progress-label"><span>Uploading...</span><span>{uploadProgress}%</span></div>
                  <div className="upload-progress-bar"><span style={{ width: `${uploadProgress}%` }} /></div>
                </div>
              )}
              <div className="file-actions">
                <button type="button" className="campus-btn campus-btn-secondary" onClick={removeSelectedFile} disabled={isUploading}>Remove</button>
                <button type="button" className="campus-btn campus-btn-primary" onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? <><LoadingSpinner size="small" label="Uploading" /> Uploading...</> : 'Upload document'}
                </button>
              </div>
            </div>
          )}

          {status.type !== 'idle' && <div className={`status-banner status-${status.type}`} aria-live="polite"><strong>{status.title}</strong><span>{status.message}</span></div>}
        </section>

        <aside className="panel info-panel">
          <div className="panel-header compact"><div><p className="panel-kicker">How it works</p><h2>Document knowledge</h2></div></div>
          <ol className="help-steps">
            <li>Upload an official document</li>
            <li>Campus-GPT processes the content</li>
            <li>The content becomes searchable knowledge</li>
            <li>Students can ask questions about it</li>
          </ol>
          <div className="helper-box"><h3>Recommended sources</h3><ul><li>Course notes</li><li>Syllabus and regulations</li><li>Department information</li><li>Campus policies</li></ul></div>
        </aside>
      </div>

      <section className="panel library-panel">
        <div className="panel-header library-header">
          <div><p className="panel-kicker">Library</p><h2>Uploaded documents</h2><p className="library-note">Persistent documents in the Campus-GPT knowledge directory.</p></div>
          <div className="library-toolbar">
            <input type="search" placeholder="Search documents" aria-label="Search documents" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <select aria-label="Filter documents" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All</option><option value="PDF">PDF</option><option value="TXT">TXT</option><option value="ready">Ready</option><option value="not_indexed">Not indexed</option></select>
          </div>
        </div>

        {libraryError && <div className="status-banner status-error" role="alert"><strong>Library unavailable</strong><span>{libraryError}</span><button type="button" className="text-action" onClick={refreshDocuments}>Retry</button></div>}
        {isLoadingLibrary ? (
          <div className="library-loading"><LoadingSpinner size="medium" label="Loading document library" /><span>Loading documents...</span></div>
        ) : filteredDocuments.length === 0 ? (
          <div className="library-empty-state"><div className="empty-state-mark" aria-hidden="true">▣</div><h3>{uploadedDocuments.length ? 'No matching documents' : 'No knowledge sources yet'}</h3><p>{uploadedDocuments.length ? 'Try another name or filter.' : 'Upload official campus documents to give Campus-GPT more knowledge to work with.'}</p>{!uploadedDocuments.length && <button type="button" className="campus-btn campus-btn-primary" onClick={openFilePicker}>Upload document</button>}</div>
        ) : (
          <div className="document-table-wrap">
            <table className="document-table"><thead><tr><th>Document</th><th>Type</th><th>Size</th><th>Uploaded</th><th>Status</th><th>Actions</th></tr></thead><tbody>
              {filteredDocuments.map((entry) => <tr key={entry.document_id}><td className="document-name-cell"><span className="inline-doc-icon" aria-hidden="true">{entry.type}</span>{entry.filename}</td><td>{entry.type}</td><td>{formatFileSize(entry.size_bytes)}</td><td>{new Date(entry.uploaded_at).toLocaleDateString()}</td><td><StatusBadge status={entry.status} /></td><td><button type="button" className="text-action" onClick={() => handleDelete(entry)} disabled={deletingDocumentId === entry.document_id} aria-label={`Delete ${entry.filename}`}>{deletingDocumentId === entry.document_id ? 'Deleting...' : 'Delete'}</button></td></tr>)}
            </tbody></table>
          </div>
        )}
      </section>
    </main>
  )
}
