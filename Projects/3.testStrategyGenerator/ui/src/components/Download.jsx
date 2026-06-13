import { FiDownload } from 'react-icons/fi';

export default function Download({ onDownload, issueId, disabled }) {
  return (
    <div className="download-container">
      <div className="success-badge">Test Strategy Ready</div>
      <p>Your test strategy for <strong>{issueId}</strong> has been generated.</p>
      <button className="btn btn-primary btn-large" onClick={onDownload} disabled={disabled}>
        <FiDownload size={18} /> Download .docx
      </button>
    </div>
  );
}
