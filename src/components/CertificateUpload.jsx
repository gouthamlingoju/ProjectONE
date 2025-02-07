import { useState } from 'react';

function CertificateUpload({ onUpload }) {
  const [certificateType, setCertificateType] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!certificateType || !file) {
      alert('Please fill in all required fields');
      return;
    }

    const newCertificate = {
      id: Date.now(),
      certificateType,
      fileName: file.name,
      status: 'pending'
    };

    onUpload(newCertificate);
    setCertificateType('');
    setFile(null);
  };

  return (
    <div className="form-group">
      <div className="form-group">
        <label htmlFor="certificateType" className="form-label">Certificate Type</label>
        <input
          id="certificateType"
          type="text"
          className="form-input"
          placeholder="e.g., SSC, CBSE"
          value={certificateType}
          onChange={(e) => setCertificateType(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="certificateFile" className="form-label">Certificate File</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            id="certificateFile"
            type="file"
            className="form-input"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button 
            className="button button-primary"
            onClick={handleSubmit}
          >
            Upload Certificate
          </button>
        </div>
        <p className="text-sm text-gray-500">Upload PDF or image files (max 5MB)</p>
      </div>
    </div>
  );
}

export default CertificateUpload;
