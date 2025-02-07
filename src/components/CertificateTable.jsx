function CertificateTable({ certificates }) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Uploaded Certificates</h3>
          <button className="button button-outline">
            Download Excel
          </button>
        </div>
  
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>File Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.certificateType}</td>
                <td>{cert.fileName}</td>
                <td>
                  <span className={`status-badge ${
                    cert.status === 'completed' ? 'status-completed' : 'status-pending'
                  }`}>
                    {cert.status}
                  </span>
                </td>
                <td>
                  <button className="button button-outline" style={{ color: '#dc2626' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default CertificateTable;
  