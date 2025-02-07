import { useState } from 'react';
import './App.css';
import CertificateUpload from './components/CertificateUpload';
import CertificateTable from './components/CertificateTable';

function App() {
  const [certificates, setCertificates] = useState([]);

  const handleCertificateUpload = (newCertificate) => {
    setCertificates([...certificates, newCertificate]);
  };

  return (
    <div>
      <header className="header">
        <h1>Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering & Technology</h1>
        <p>NAAC Accredited with A++ Grade</p>
      </header>

      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">CERTIFICATE-EXCEL</h2>
          </div>
          <div className="card-content">
            <CertificateUpload onUpload={handleCertificateUpload} />
            <CertificateTable certificates={certificates} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
