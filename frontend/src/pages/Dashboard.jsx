import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = `/api/files`;
const AUTH_URL = `/api/auth`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #050810;
    font-family: 'DM Mono', monospace;
  }

  .dashboard-root {
    min-height: 100vh;
    background: #050810;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    position: relative;
    overflow-x: hidden;
  }

  /* Ambient background orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
    animation: drift 12s ease-in-out infinite alternate;
  }
  .orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
    top: -200px; left: -100px;
    animation-delay: 0s;
  }
  .orb-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    animation-delay: -5s;
  }
  .orb-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%);
    top: 40%; left: 60%;
    animation-delay: -8s;
  }
  @keyframes drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, 40px) scale(1.08); }
  }

  /* Grain overlay */
  .grain {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .content-wrap {
    position: relative; z-index: 1;
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 56px;
    animation: fadeUp 0.6s ease both;
  }

  .brand {
    display: flex; align-items: center; gap: 14px;
  }
  .brand-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #6366f1, #10b981);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 0 20px rgba(99,102,241,0.4);
  }
  .brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(90deg, #a5b4fc, #6ee7b7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }

  .btn-logout {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 9px 20px;
    background: transparent;
    color: #f87171;
    border: 1px solid rgba(248,113,113,0.35);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-logout::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(248,113,113,0.08);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .btn-logout:hover::before { opacity: 1; }
  .btn-logout:hover {
    border-color: rgba(248,113,113,0.7);
    box-shadow: 0 0 16px rgba(248,113,113,0.2);
  }

  /* ── STATS ── */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 40px;
    animation: fadeUp 0.6s ease 0.1s both;
  }

  .stat-card {
    position: relative;
    padding: 28px 28px 24px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
  }
  .stat-card:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.13);
  }
  .stat-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
  }
  .stat-card:nth-child(2)::after {
    background: linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent);
  }

  .stat-label {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .stat-label-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #6366f1;
    box-shadow: 0 0 6px #6366f1;
  }
  .stat-card:nth-child(2) .stat-label-dot {
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1;
    letter-spacing: -2px;
  }
  .stat-unit {
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    font-weight: 400;
    color: #475569;
    letter-spacing: 0.05em;
    margin-left: 4px;
  }

  /* ── UPLOAD ── */
  .upload-zone {
    position: relative;
    padding: 32px;
    border-radius: 16px;
    border: 1px dashed rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.04);
    text-align: center;
    margin-bottom: 40px;
    transition: all 0.25s ease;
    cursor: pointer;
    animation: fadeUp 0.6s ease 0.2s both;
  }
  .upload-zone:hover {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.08);
  }

  .upload-icon {
    width: 52px; height: 52px;
    margin: 0 auto 16px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .upload-label {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #a5b4fc;
    margin-bottom: 6px;
  }
  .upload-sub {
    font-size: 0.72rem;
    color: #475569;
    letter-spacing: 0.06em;
  }
  .upload-input {
    position: absolute; inset: 0;
    opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .upload-input:disabled { cursor: not-allowed; }

  .uploading-bar {
    margin-top: 20px;
    height: 3px;
    background: rgba(99,102,241,0.15);
    border-radius: 999px;
    overflow: hidden;
  }
  .uploading-bar-fill {
    height: 100%;
    width: 40%;
    background: linear-gradient(90deg, #6366f1, #10b981);
    border-radius: 999px;
    animation: shimmer 1.2s ease-in-out infinite;
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  .uploading-text {
    margin-top: 10px;
    font-size: 0.72rem;
    color: #6366f1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ── FILES TABLE ── */
  .files-panel {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    animation: fadeUp 0.6s ease 0.3s both;
  }

  .files-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 22px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .files-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #94a3b8;
  }
  .files-count-badge {
    font-size: 0.7rem;
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 20px;
    padding: 3px 10px;
    letter-spacing: 0.04em;
  }

  table { width: 100%; border-collapse: collapse; }

  thead tr {
    background: rgba(0,0,0,0.2);
  }
  th {
    padding: 12px 20px;
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #334155;
    text-align: left;
  }
  th:last-child { text-align: right; }

  tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,0.025); }

  td {
    padding: 16px 20px;
    font-size: 0.82rem;
    vertical-align: middle;
  }

  .file-name {
    font-weight: 500;
    color: #e2e8f0;
    display: flex; align-items: center; gap: 10px;
  }
  .file-ext-badge {
    font-size: 0.58rem;
    padding: 2px 7px;
    background: rgba(255,255,255,0.06);
    border-radius: 4px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    flex-shrink: 0;
  }

  .file-size { color: #475569; }

  .dl-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.15);
    color: #6ee7b7;
    font-size: 0.72rem;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .actions-cell { text-align: right; }

  .btn-download {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    padding: 7px 16px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    margin-right: 8px;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(99,102,241,0.25);
  }
  .btn-download:hover {
    box-shadow: 0 4px 16px rgba(99,102,241,0.4);
    transform: translateY(-1px);
  }

  .btn-delete {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    padding: 7px 14px;
    background: transparent;
    color: #ef4444;
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-delete:hover {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.5);
    box-shadow: 0 0 12px rgba(239,68,68,0.15);
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #1e293b;
  }
  .empty-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5; }
  .empty-text {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #334155;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .stats-grid { grid-template-columns: 1fr; }
    .stat-value { font-size: 2.2rem; }
    .btn-download, .btn-delete { padding: 6px 10px; }
  }
`;

export const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState({ totalFiles: 0, totalStorageUsed: 0 });
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const verifyAndLoad = async () => {
            try {
                const authRes = await fetch(`${AUTH_URL}/check-auth`, { credentials: 'include' });
                const authData = await authRes.json();
                if (!authData.success) { navigate('/login'); return; }
                fetchData();
            } catch (error) {
                console.error("Authentication check failed:", error);
                navigate('/login');
            }
        };
        verifyAndLoad();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const statsRes = await fetch(`${API_URL}/stats`, { credentials: 'include' });
            const statsData = await statsRes.json();
            if (statsData.success) setStats(statsData.stats);

            const filesRes = await fetch(API_URL, { credentials: 'include' });
            const filesData = await filesRes.json();
            if (filesData.success) setFiles(filesData.files || filesData.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData, credentials: 'include' });
            const data = await res.json();
            if (data.success) { fetchData(); } else { alert('Upload failed: ' + data.message); }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const res = await fetch(`${API_URL}/download/${fileId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) { window.open(data.url, '_blank'); fetchData(); }
        } catch (error) { console.error("Download error:", error); }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;
        try {
            const res = await fetch(`${API_URL}/delete/${fileId}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (data.success) fetchData();
        } catch (error) { console.error("Delete error:", error); }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${AUTH_URL}/logout`, { method: 'POST', credentials: 'include' });
            navigate('/login');
        } catch (error) { console.error("Logout error:", error); }
    };

    const getExt = (name) => name?.split('.').pop()?.toUpperCase() || '---';
    const storageMB = (stats.totalStorageUsed / (1024 * 1024)).toFixed(2);

    return (
        <>
            <style>{styles}</style>
            <div className="dashboard-root">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
                <div className="grain" />

                <div className="content-wrap">

                    {/* ── HEADER ── */}
                    <header className="header">
                        <div className="brand">
                            <div className="brand-icon">🔐</div>
                            <span className="brand-name">Secure Cloud</span>
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>
                            ⎋ &nbsp;Log Out
                        </button>
                    </header>

                    {/* ── STATS ── */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">
                                <span className="stat-label-dot" />
                                Total Files
                            </div>
                            <div className="stat-value">{stats.totalFiles}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">
                                <span className="stat-label-dot" />
                                Storage Used
                            </div>
                            <div className="stat-value">
                                {storageMB}
                                <span className="stat-unit">MB</span>
                            </div>
                        </div>
                    </div>

                    {/* ── UPLOAD ── */}
                    <div className="upload-zone">
                        <input
                            className="upload-input"
                            type="file"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                        <div className="upload-icon">📤</div>
                        <div className="upload-label">
                            {uploading ? 'Uploading…' : 'Drop a file or click to upload'}
                        </div>
                        <div className="upload-sub">
                            {uploading ? 'Sending to AWS Sandbox' : 'Any format · Encrypted in transit'}
                        </div>
                        {uploading && (
                            <div>
                                <div className="uploading-bar">
                                    <div className="uploading-bar-fill" />
                                </div>
                                <div className="uploading-text">Uploading…</div>
                            </div>
                        )}
                    </div>

                    {/* ── FILES ── */}
                    <div className="files-panel">
                        <div className="files-header">
                            <span className="files-title">My Files</span>
                            <span className="files-count-badge">{files.length} items</span>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Size</th>
                                    <th>Downloads</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map(file => (
                                    <tr key={file._id}>
                                        <td>
                                            <div className="file-name">
                                                <span className="file-ext-badge">{getExt(file.originalName)}</span>
                                                {file.originalName}
                                            </div>
                                        </td>
                                        <td className="file-size">{(file.fileSize / 1024).toFixed(1)} KB</td>
                                        <td>
                                            <span className="dl-badge">
                                                ↓ {file.downloadCount}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button className="btn-download" onClick={() => handleDownload(file._id)}>
                                                Download
                                            </button>
                                            <button className="btn-delete" onClick={() => handleDelete(file._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {files.length === 0 && (
                                    <tr>
                                        <td colSpan="4">
                                            <div className="empty-state">
                                                <div className="empty-icon">🗂</div>
                                                <div className="empty-text">No files uploaded yet</div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
};