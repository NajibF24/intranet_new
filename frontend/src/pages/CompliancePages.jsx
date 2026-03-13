import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PageContainer } from '../components/layout/PageContainer';
import {
  FileText, AlertTriangle, Shield, CheckCircle,
  Target, Building2, UserCircle, Cog, Scale, CircleCheck,
  Network, Workflow, Download, FileBox, Bot, X,
  Minimize2, Maximize2, Loader2, RefreshCw, FolderOpen,
  FileSpreadsheet, FileImage, FilePieChart, Archive,
  Upload, CheckCircle2, XCircle, LogIn, Eye, EyeOff, LogOut,
  ExternalLink, ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const BOT_ID      = '69ae8ac11243a25591412b11';
const BOT_ORIGIN  = 'https://chat.gyssteel.com';
const ACCENT      = '%23007857';

const DEPT_FOLDER_MAP = {
  'sms':         '01. GYS_Steel Melting Shop-1 (SMS-1)',
  'bp':          '02. GYS_Beam Plant (BP)',
  'lsm':         '03. GYS_Light Section Mill (LSM)',
  'ssc':         '04. GYS_Steel Service Center (SSC)',
  'iso':         '05. GYS_ISO (Management System)',
  'procurement': '06. GYS_PROCUREMENT (PRC)',
  'sales':       '07. GYS_SALES (SLS)',
  'hrga':        '08. GYS_HRGA',
  'it':          '09. GYS_IT SYSTEM (IT)',
  'gdu-scm':     '11. GYS_GDU & SCM',
  'finance':     '12. GYS_Finance & Accounting',
  'legal':       '13. GYS_Legal (LGL)',
  'qaqc':        '14. GYS_QAQC',
};

const departmentsData = [
  { id: 'sms',         title: 'SMS',                    fullName: 'Steel Melting Shop',                 icon: Target,       description: 'Access procedures, operational guidelines, and policies for the Steel Melting Shop.',  lastUpdated: 'April 2026' },
  { id: 'bp',          title: 'BP',                     fullName: 'Beam Plant',                          icon: Building2,    description: 'View BP operational manuals and quality standards.',                                   lastUpdated: 'March 2026' },
  { id: 'lsm',         title: 'LSM',                    fullName: 'Light Section Mill',                  icon: FileBox,      description: 'Maintain LSM protocols and procedures.',                                                lastUpdated: 'February 2026' },
  { id: 'ssc',         title: 'SSC',                    fullName: 'Steel Service Center',                icon: UserCircle,   description: 'SSC Service guidelines and reporting processes.',                                       lastUpdated: 'January 2026' },
  { id: 'iso',         title: 'ISO Management System',  fullName: 'Management System',                   icon: Shield,       description: 'Access ISO 9001, 14001, and 45001 standards.',                                         lastUpdated: 'April 2026' },
  { id: 'procurement', title: 'Procurement',            fullName: 'Procurement (PRC)',                   icon: Cog,          description: 'Vendor selection and purchase order workflows.',                                        lastUpdated: 'March 2026' },
  { id: 'sales',       title: 'Sales',                  fullName: 'Sales (SLS)',                         icon: Target,       description: 'Client onboarding and sales contract procedures.',                                     lastUpdated: 'April 2026' },
  { id: 'hrga',        title: 'HRGA',                   fullName: 'Human Resources & General Affairs',   icon: Workflow,     description: 'Employee lifecycle and general affairs guidelines.',                                    lastUpdated: 'March 2026' },
  { id: 'it',          title: 'IT',                     fullName: 'Information Technology',              icon: Network,      description: 'IT security, device tracking, and user support.',                                      lastUpdated: 'February 2026' },
  { id: 'gdu-scm',     title: 'GDU & SCM',              fullName: 'Supply Chain Management',             icon: Cog,          description: 'Supply chain logistics and material handling.',                                         lastUpdated: 'January 2026' },
  { id: 'finance',     title: 'Finance & Accounting',   fullName: 'Finance & Accounting',                icon: FileText,     description: 'Expense reimbursement and financial closing protocols.',                                 lastUpdated: 'April 2026' },
  { id: 'legal',       title: 'Legal',                  fullName: 'Legal (LGL)',                         icon: Scale,        description: 'Contract review and NDA guidelines.',                                                   lastUpdated: 'March 2026' },
  { id: 'qaqc',        title: 'QA/QC',                  fullName: 'Quality Assurance / Quality Control', icon: CircleCheck,  description: 'Product quality inspection and testing procedures.',                                   lastUpdated: 'February 2026' },
];

// ── Auth helpers (sessionStorage) ────────────────────────────
const AUTH_KEY = 'gys_upload_token';
const USER_KEY = 'gys_upload_user';

const getStoredAuth = () => {
  try {
    const token = sessionStorage.getItem(AUTH_KEY);
    const user  = JSON.parse(sessionStorage.getItem(USER_KEY) || 'null');
    return token && user ? { token, user } : null;
  } catch { return null; }
};

const setStoredAuth = (token, user) => {
  sessionStorage.setItem(AUTH_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearStoredAuth = () => {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
};

// ── File helpers ──────────────────────────────────────────────
const getFileIcon = (filename) => {
  const ext = (filename || '').split('.').pop().toLowerCase();
  if (['xlsx', 'xls', 'csv'].includes(ext))        return FileSpreadsheet;
  if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return FileImage;
  if (['pptx', 'ppt'].includes(ext))               return FilePieChart;
  if (['zip', 'rar', '7z'].includes(ext))          return Archive;
  return FileText;
};

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const groupDocuments = (documents) => {
  const hasSubfolders = documents.some(d => d.subfolder);
  if (!hasSubfolders) return [{ label: '', docs: documents }];
  const groups = {};
  for (const doc of documents) {
    const key = doc.subfolder || '__root__';
    if (!groups[key]) groups[key] = [];
    groups[key].push(doc);
  }
  return Object.entries(groups).map(([key, docs]) => ({
    label: key === '__root__' ? 'General' : key,
    docs,
  }));
};

// ── Login Modal ───────────────────────────────────────────────
const LoginModal = ({ onClose, onSuccess }) => {
  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Username and password are required'); return; }
    setLoading(true);
    setError('');
    try {
      // Kirim ke endpoint login yang sudah ada
      // username bisa pakai format email atau sAMAccountName
      const email = username.includes('@') ? username : `${username}@gyssteel.com`;
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = res.data;
      setStoredAuth(token, user);
      onSuccess(token, user);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your username and password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0C765B]/10 rounded-xl flex items-center justify-center">
              <LogIn className="w-5 h-5 text-[#0C765B]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Login to Upload</h2>
              <p className="text-xs text-slate-500">Use your Active Directory account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="username or email@gyssteel.com"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C765B]/30 focus:border-[#0C765B] transition-colors"
              autoFocus
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0C765B]/30 focus:border-[#0C765B] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Info */}
          <p className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
            🔒 Login is only required for uploading documents. Session ends when the browser is closed.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#0C765B] text-white rounded-xl text-sm font-medium hover:bg-[#0a614b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Verifying...' : 'Login & Continue'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ── Upload Modal ──────────────────────────────────────────────
const UploadModal = ({ folderName, token, user, onClose, onSuccess, onLogout }) => {
  const [file,           setFile]          = useState(null);
  const [uploading,      setUploading]     = useState(false);
  const [status,         setStatus]        = useState(null);
  const [message,        setMessage]       = useState('');
  const [dragOver,       setDragOver]      = useState(false);
  const [subfolders,     setSubfolders]    = useState([]);
  const [targetFolder,   setTargetFolder]  = useState('__root__');
  const [loadingFolders, setLoadingFolders] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSubfolders = async () => {
      setLoadingFolders(true);
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/onedrive/subfolders/${encodeURIComponent(folderName)}`
        );
        setSubfolders(res.data.subfolders || []);
      } catch {
        setSubfolders([]);
      } finally {
        setLoadingFolders(false);
      }
    };
    fetchSubfolders();
  }, [folderName]);

  const getUploadPath = () =>
    targetFolder === '__root__' ? folderName : `${folderName}/${targetFolder}`;

  const validateFile = (f) => {
    if (!f) return 'Please select a file first';
    if (!f.name.toLowerCase().endsWith('.pdf')) return 'Only PDF files are allowed';
    if (f.size > 50 * 1024 * 1024) return `File too large (${(f.size/1024/1024).toFixed(1)}MB). Maximum 50MB`;
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    const err = validateFile(file);
    if (err) { setStatus('error'); setMessage(err); return; }
    setUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/onedrive/upload/${encodeURIComponent(getUploadPath())}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } }
      );
      setStatus('success');
      setMessage(`"${res.data.filename}" uploaded successfully`);
      setTimeout(() => { onSuccess(); onClose(); }, 1800);
    } catch (err) {
      if (err.response?.status === 401) { clearStoredAuth(); onLogout(); return; }
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload Document</h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px]">📁 {folderName}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* User badge + logout */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0C765B]/10 rounded-full">
              <div className="w-4 h-4 rounded-full bg-[#0C765B] flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-xs font-medium text-[#0C765B] max-w-[100px] truncate">
                {user?.name || user?.email}
              </span>
              <button
                onClick={onLogout}
                title="Logout"
                className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Folder picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Upload to Folder
            </label>
            {loadingFolders ? (
              <div className="flex items-center gap-2 text-sm text-slate-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading folders...</span>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {/* Root folder option */}
                <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors
                  ${targetFolder === '__root__'
                    ? 'border-[#0C765B] bg-[#0C765B]/5'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <input type="radio" name="folder" value="__root__"
                    checked={targetFolder === '__root__'}
                    onChange={() => setTargetFolder('__root__')}
                    className="accent-[#0C765B]" />
                  <FolderOpen className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 font-medium">Root (no subfolder)</span>
                </label>
                {/* Subfolders */}
                {subfolders.map(sf => (
                  <label key={sf.id} className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors
                    ${targetFolder === sf.name
                      ? 'border-[#0C765B] bg-[#0C765B]/5'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                    <input type="radio" name="folder" value={sf.name}
                      checked={targetFolder === sf.name}
                      onChange={() => setTargetFolder(sf.name)}
                      className="accent-[#0C765B]" />
                    <FolderOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 truncate">{sf.name}</span>
                  </label>
                ))}
                {subfolders.length === 0 && (
                  <p className="text-xs text-slate-400 px-1">No subfolders found. File will be uploaded to the root folder.</p>
                )}
              </div>
            )}
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-[#0C765B] bg-[#0C765B]/5'
                : file    ? 'border-[#0C765B]/50 bg-[#0C765B]/5'
                          : 'border-slate-200 hover:border-[#0C765B]/40 hover:bg-slate-50'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => { setFile(e.target.files[0] || null); setStatus(null); }}
            />
            {file ? (
              <div className="space-y-1">
                <FileText className="w-10 h-10 text-[#0C765B] mx-auto" />
                <p className="font-semibold text-slate-800 text-sm truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                <p className="text-xs text-[#0C765B]">Click to change file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-medium text-slate-600">Drag & drop or click to select a file</p>
                <p className="text-xs text-slate-400">PDF only · Maximum 50MB</p>
              </div>
            )}
          </div>

          {/* Status */}
          {status && (
            <div className={`flex items-start gap-2.5 p-3 rounded-xl text-sm
              ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status === 'success'
                ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                : <XCircle     className="w-4 h-4 flex-shrink-0 mt-0.5" />}
              <span>{message}</span>
            </div>
          )}

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-[#0C765B]" />
              <span>Uploading to OneDrive...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading || status === 'success'}
            className="flex-1 py-2.5 bg-[#0C765B] text-white rounded-xl text-sm font-medium hover:bg-[#0a614b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Document Preview Modal ────────────────────────────────────
const DocumentPreviewModal = ({ doc, onClose, onDownload }) => {
  const [blobUrl,  setBlobUrl]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch file as blob → create local object URL → no cross-origin iframe issue
  useEffect(() => {
    let objectUrl = null;
    const fetchBlob = async () => {
      setLoading(true);
      setError(false);
      setProgress(0);
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/onedrive/stream/${doc.id}`,
          {
            responseType: 'blob',
            onDownloadProgress: (e) => {
              if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
            },
          }
        );
        objectUrl = URL.createObjectURL(res.data);
        setBlobUrl(objectUrl);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlob();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [doc.id]);

  // Trap body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="font-semibold text-slate-800 truncate text-sm">{doc.name}</span>
          {doc.subfolder && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
              <FolderOpen className="w-3 h-3" />{doc.subfolder}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <button onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0C765B] text-white text-xs font-medium rounded-lg hover:bg-[#0a614b] transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Download</span>
          </button>
          {blobUrl && (
            <button onClick={() => window.open(blobUrl, '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Open in Tab</span>
            </button>
          )}
          <button onClick={onClose} title="Close (Esc)"
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 relative overflow-hidden bg-slate-200">
        {/* Loading with progress bar */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-100 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#0C765B]" />
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-2">
                {progress > 0 ? `Loading document... ${progress}%` : 'Connecting to server...'}
              </p>
              {progress > 0 && (
                <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-[#0C765B] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error fallback */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-100 z-10">
            <FileText className="w-16 h-16 text-slate-300" />
            <div className="text-center">
              <p className="font-medium text-slate-600 mb-1">Preview not available</p>
              <p className="text-sm text-slate-400 mb-4">Unable to load this file.</p>
              <button onClick={onDownload}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-[#0C765B] text-white text-sm font-medium rounded-lg hover:bg-[#0a614b] transition-colors">
                <Download className="w-4 h-4" />
                Download to view
              </button>
            </div>
          </div>
        )}

        {/* Render from local blob URL — completely bypasses cross-origin restriction */}
        {blobUrl && (
          <iframe src={blobUrl} className="w-full h-full border-0"
            title={doc.name} allow="fullscreen" />
        )}
      </div>
    </div>
  );
};

// ── Document Row ──────────────────────────────────────────────
const DocumentRow = ({ doc }) => {
  const [dlLoading,   setDlLoading]   = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const FileIcon = getFileIcon(doc.name);

  const handleDownload = async () => {
    setDlLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/onedrive/download-url/${doc.id}`);
      window.open(res.data.download_url || doc.web_url, '_blank', 'noopener,noreferrer');
    } catch {
      if (doc.web_url) window.open(doc.web_url, '_blank', 'noopener,noreferrer');
    } finally {
      setDlLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-[#0C765B]/5 transition-colors group border border-transparent hover:border-[#0C765B]/20">
        {/* File info — click to preview */}
        <div
          className="flex items-center space-x-3 overflow-hidden flex-1 min-w-0 cursor-pointer"
          onClick={() => setShowPreview(true)}
        >
          <FileIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-slate-700 font-medium truncate text-sm group-hover:text-[#0C765B] transition-colors">{doc.name}</p>
            {doc.size > 0 && <p className="text-xs text-slate-400">{formatSize(doc.size)}</p>}
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
          <button
            onClick={() => setShowPreview(true)}
            title="View"
            className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-[#0C765B] hover:bg-[#0C765B]/10 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
            <span className="text-sm font-medium">View</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={dlLoading}
            title="Download"
            className="p-2 text-slate-400 hover:text-[#0C765B] hover:bg-[#0C765B]/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {dlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <DocumentPreviewModal
              doc={doc}
              onClose={() => setShowPreview(false)}
              onDownload={handleDownload}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Folder Group ──────────────────────────────────────────────
const FolderGroup = ({ label, docs }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-6">
      {label && (
        <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-2 mb-3 group">
          <FolderOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors text-left flex-1 truncate">{label}</span>
          <span className="text-xs text-slate-400 flex-shrink-0">{docs.length} files</span>
          <span className="text-xs text-slate-400 ml-1">{open ? '▲' : '▼'}</span>
        </button>
      )}
      {open && (
        <div className="space-y-2 pl-6">
          {docs.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
        </div>
      )}
    </div>
  );
};

// ── MyGYS Bot ─────────────────────────────────────────────────
const MyGYSBot = ({ dept }) => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeKey,   setIframeKey]   = useState(0);
  const iframeRef = useRef(null);
  const folderName = DEPT_FOLDER_MAP[dept.id] || dept.title;
  const deptLabel  = dept.fullName || dept.title;
  const iframeSrc  = `${BOT_ORIGIN}/embed/${BOT_ID}?theme=light&accent=${ACCENT}&brand=true`;
  const sendCtx = () => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'GYS_DEPT_CONTEXT', dept: dept.id, deptLabel, folderName,
        systemNote: `User is on the "${deptLabel}". Focus on SOPs & Policies from folder "${folderName}".` },
      BOT_ORIGIN
    );
  };
  useEffect(() => { setIframeReady(false); setIframeKey(p => p + 1); }, [dept.id]);
  useEffect(() => { if (isOpen && iframeReady) setTimeout(sendCtx, 400); }, [isOpen]);
  const w = isMaximized ? 'w-[520px]' : 'w-80 sm:w-96';
  const h = isMaximized ? 'h-[700px]' : 'h-[500px]';
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.2 }}
            className={`bg-white rounded-2xl shadow-2xl ${w} overflow-hidden flex flex-col border border-slate-200 mb-4 ${h}`}>
            <div className="bg-[#0C765B] px-4 py-3 flex justify-between items-center text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg"><Bot className="w-4 h-4" /></div>
                <div>
                  <h3 className="font-bold text-sm">MyGYS Bot</h3>
                  <p className="text-[10px] text-green-100 truncate max-w-[180px]">📂 {deptLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMaximized(v => !v)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <iframe key={iframeKey} ref={iframeRef} src={iframeSrc}
              onLoad={() => { setIframeReady(true); setTimeout(sendCtx, 800); }}
              className="flex-1 w-full border-0 bg-white" title={`MyGYS Bot — ${deptLabel}`} allow="clipboard-write" />
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(true)}
          className="bg-[#0C765B] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-[#0a614b] transition-colors flex items-center gap-2.5">
          <Bot className="w-5 h-5" />
          <span className="font-semibold text-sm whitespace-nowrap">Ask MyGYS</span>
        </motion.button>
      )}
    </div>
  );
};

// ── Department Card ───────────────────────────────────────────
const DepartmentCard = ({ dept, delay, onClick }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-[#0C765B]/30 transition-all cursor-pointer flex flex-col h-full group">
    <div className="w-12 h-12 bg-[#0C765B]/10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 group-hover:scale-110 transition-transform">
      <dept.icon className="w-6 h-6 text-[#0C765B]" />
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-bold text-slate-900 mb-1">{dept.title}</h3>
      {dept.fullName && <p className="text-xs font-semibold text-[#0C765B] mb-2">{dept.fullName}</p>}
      <p className="text-slate-600 text-sm mb-4">{dept.description}</p>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <span className="text-xs text-slate-500">Updated: {dept.lastUpdated}</span>
      <span className="text-[#0C765B] text-sm font-medium group-hover:underline">Open →</span>
    </div>
  </motion.div>
);

const PolicyCard = ({ icon: Icon, title, description, lastUpdated, delay }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 bg-[#0C765B]/10 rounded-xl flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#0C765B]" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title} Policy</h3>
    <p className="text-slate-600 text-sm mb-4">{description}</p>
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <span className="text-xs text-slate-500">Last updated: {lastUpdated}</span>
      <button className="text-[#0C765B] text-sm font-medium hover:underline">Read Policy</button>
    </div>
  </motion.div>
);

const SafetyRule = ({ number, text }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: number * 0.05 }}
    className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
    <div className="w-8 h-8 bg-[#0C765B] rounded-full flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-sm">{number}</span>
    </div>
    <p className="text-slate-700">{text}</p>
  </motion.div>
);

// ── Department Detail Page ────────────────────────────────────
export const DepartmentDetailPage = () => {
  const { deptId } = useParams();
  const dept = departmentsData.find(d => d.id === deptId);

  const [documents,  setDocuments]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // Upload auth state
  const [auth,       setAuth]       = useState(() => getStoredAuth());  // { token, user } | null
  const [showLogin,  setShowLogin]  = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const folderName = DEPT_FOLDER_MAP[deptId] || '';

  const fetchDocuments = async () => {
    if (!folderName) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/onedrive/documents/${encodeURIComponent(folderName)}`
      );
      setDocuments(res.data.documents || []);
    } catch {
      setError('Failed to load documents. Please check your connection or OneDrive configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, [deptId]);

  // Klik tombol Upload
  const handleUploadClick = () => {
    if (auth) {
      setShowUpload(true);   // sudah login → langsung buka upload modal
    } else {
      setShowLogin(true);    // belum login → buka login modal dulu
    }
  };

  // Setelah login berhasil
  const handleLoginSuccess = (token, user) => {
    setAuth({ token, user });
    setShowLogin(false);
    setShowUpload(true);   // langsung lanjut ke upload modal
  };

  // Logout dari sesi upload
  const handleLogout = () => {
    clearStoredAuth();
    setAuth(null);
    setShowUpload(false);
  };

  if (!dept) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <h2 className="text-2xl font-bold text-slate-700">Department Not Found</h2>
    </div>
  );

  const groups = groupDocuments(documents);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageContainer
        title={`${dept.title} Documents`}
        subtitle={dept.fullName ? `${dept.fullName} — ${dept.description}` : dept.description}
        breadcrumbs={[{ label: 'Procedures & Policies', path: '/compliance/sop' }, { label: dept.title }]}
        category="compliance"
      >
        <div className="max-w-4xl">

          {/* Banner bot */}
          <div className="mb-6 flex items-center gap-3 bg-[#0C765B]/5 border border-[#0C765B]/20 rounded-xl px-5 py-3.5">
            <Bot className="w-5 h-5 text-[#0C765B] flex-shrink-0" />
            <p className="text-sm text-slate-600">
              Have questions about <strong>{dept.fullName || dept.title}</strong>?{' '}
              <span className="text-[#0C765B] font-semibold">Click the Ask MyGYS button</span> at the bottom right.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              <span>Loading documents from OneDrive...</span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium mb-1">Failed to Load Documents</p>
                  <p className="text-red-600 text-sm mb-3">{error}</p>
                  <button onClick={fetchDocuments} className="flex items-center gap-2 text-sm text-red-600 font-medium">
                    <RefreshCw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {!loading && !error && (
            <>
              {/* Action bar */}
              <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="w-4 h-4 text-[#0C765B]" />
                  <span><strong className="text-[#0C765B]">{documents.length}</strong> documents found</span>
                  {groups.length > 1 && <span className="text-slate-400">· {groups.length} folder</span>}
                  {/* Badge login status */}
                  {auth && (
                    <span className="ml-1 flex items-center gap-1 text-xs text-[#0C765B] bg-[#0C765B]/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {auth.user?.name || auth.user?.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleUploadClick}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#0C765B] text-white text-sm font-medium rounded-lg hover:bg-[#0a614b] transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:block">Upload PDF</span>
                  </button>
                  <button onClick={fetchDocuments}
                    className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-sm text-slate-500 hover:text-[#0C765B] rounded-lg transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:block">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Document list */}
              {documents.length > 0 && groups.map((group, idx) => (
                <FolderGroup key={idx} label={group.label} docs={group.docs} />
              ))}

              {/* Empty state */}
              {documents.length === 0 && (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <FileBox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No documents yet</p>
                  <p className="text-slate-400 text-sm mt-1 mb-4">
                    Folder <code className="bg-slate-100 px-1 rounded text-xs">{folderName}</code> empty
                  </p>
                  <button onClick={handleUploadClick}
                    className="mx-auto flex items-center gap-2 px-4 py-2 bg-[#0C765B] text-white text-sm font-medium rounded-lg hover:bg-[#0a614b] transition-colors">
                    <Upload className="w-4 h-4" /> Upload Document Pertama
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </PageContainer>

      {/* Modals */}
      <AnimatePresence>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={handleLoginSuccess}
          />
        )}
        {showUpload && auth && (
          <UploadModal
            folderName={folderName}
            token={auth.token}
            user={auth.user}
            onClose={() => setShowUpload(false)}
            onSuccess={fetchDocuments}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      <MyGYSBot dept={dept} />
      <Footer />
    </div>
  );
};

// ── SOP Index ─────────────────────────────────────────────────
export const SOPPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageContainer
        title="Procedures & Policies"
        subtitle="Access all department Standard Operating Procedures and Policies documentation."
        breadcrumbs={[{ label: 'Procedures & Policies', path: '/compliance' }, { label: 'Procedures & Policies' }]}
        category="compliance"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentsData.map((dept, idx) => (
            <DepartmentCard key={dept.id} dept={dept} delay={idx * 0.05}
              onClick={() => navigate(`/compliance/department/${dept.id}`)} />
          ))}
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const PoliciesPage = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <PageContainer title="Company Policies"
      subtitle="Essential policies that govern our operations and guide employee conduct at PT Garuda Yamato Steel."
      breadcrumbs={[{ label: 'Procedures & Policies', path: '/compliance' }, { label: 'Policies' }]}
      category="compliance">
      <div className="grid md:grid-cols-2 gap-6">
        <PolicyCard icon={Shield}        title="Information Security Policy" description="Guidelines for protecting company data and information systems from unauthorized access." lastUpdated="January 2026"  delay={0}   />
        <PolicyCard icon={AlertTriangle} title="Health & Safety Policy"      description="Our commitment to maintaining a safe and healthy workplace for all employees."           lastUpdated="December 2025" delay={0.1} />
        <PolicyCard icon={FileText}      title="Code of Conduct"             description="Standards of behavior and ethical guidelines for all GYS employees and partners."        lastUpdated="November 2025" delay={0.2} />
        <PolicyCard icon={CheckCircle}   title="Quality Assurance Policy"    description="Our framework for ensuring consistent product quality and continuous improvement."       lastUpdated="October 2025"  delay={0.3} />
      </div>
    </PageContainer>
    <Footer />
  </div>
);

export const SafetyPage = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <PageContainer title="Safety Guidelines"
      subtitle="Your safety is our top priority. Follow these guidelines to ensure a safe working environment."
      breadcrumbs={[{ label: 'Procedures & Policies', path: '/compliance' }, { label: 'Safety Guidelines' }]}
      category="compliance">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-amber-900 mb-2">Safety First</h3>
            <p className="text-amber-800">At PT Garuda Yamato Steel, we believe that every accident is preventable. Safety is not just a policy — it is a core value that guides everything we do.</p>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Essential Safety Rules</h2>
      <div className="space-y-4">
        <SafetyRule number={1} text="Always wear appropriate Personal Protective Equipment (PPE)" />
        <SafetyRule number={2} text="Report all incidents and near-misses immediately" />
        <SafetyRule number={3} text="Follow lockout/tagout procedures before maintenance" />
        <SafetyRule number={4} text="Keep work areas clean and organized" />
        <SafetyRule number={5} text="Know the location of emergency exits and assembly points" />
        <SafetyRule number={6} text="Never operate equipment without proper training" />
        <SafetyRule number={7} text="Follow all posted safety signs and warnings" />
        <SafetyRule number={8} text="Participate in regular safety training and drills" />
      </div>
    </PageContainer>
    <Footer />
  </div>
);
