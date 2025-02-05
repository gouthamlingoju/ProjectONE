import React, { useState } from "react";
import * as XLSX from "xlsx";

// Utility functions
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateFileSize(file) {
  return file.size <= MAX_FILE_SIZE;
}

function validateFileType(file) {
  return file.type.includes("pdf") || file.type.includes("image/");
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function App() {
  const [certificates, setCertificates] = useState([]);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent page reload

    const fileInput = document.getElementById("certificateFile");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file");
      return;
    }

    // Validate file size and type
    if (!validateFileSize(file)) {
      alert(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }
    if (!validateFileType(file)) {
      alert("Please upload a PDF or image file");
      return;
    }

    const base64String = await fileToBase64(file);
    const newCertificate = {
      studentName: document.getElementById("studentName").value,
      certificateType: document.getElementById("certificateType").value,
      issueDate: document.getElementById("issueDate").value,
      description: document.getElementById("description").value,
      fileName: file.name,
      fileData: base64String.split(",")[1],
    };

    setCertificates((prevCertificates) => [
      ...prevCertificates,
      newCertificate,
    ]);
    alert("Certificate uploaded successfully");
    document.getElementById("certificateForm").reset(); // Reset form
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Download Excel with certificates data
  const handleDownloadExcel = () => {
    const formattedCertificates = certificates.map((cert) => ({
      "Student Name": cert.studentName,
      "Certificate Type": cert.certificateType,
      "Issue Date": new Date(cert.issueDate).toLocaleDateString(),
      Description: cert.description,
      "File Name": cert.fileName,
      "File Data": cert.fileData,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedCertificates);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Certificates");
    XLSX.writeFile(wb, "certificates.xlsx");
  };

  return (
    <div className="App">
      <h1>Upload Certificate</h1>
      <form id="certificateForm" onSubmit={handleUpload}>
        <input
          type="text"
          id="studentName"
          placeholder="Student Name"
          required
        />
        <input
          type="text"
          id="certificateType"
          placeholder="Certificate Type"
          required
        />
        <input type="date" id="issueDate" required />
        <textarea
          id="description"
          placeholder="Description"
          rows="3"
        ></textarea>
        <input
          type="file"
          id="certificateFile"
          accept=".pdf,.jpg,.jpeg,.png"
          required
        />
        <button type="submit">Upload</button>
      </form>

      <h2>Uploaded Certificates</h2>
      <div>
        {certificates.length === 0 ? (
          <p>No certificates uploaded yet</p>
        ) : (
          certificates.map((cert, index) => (
            <div key={index} className="certificate-card">
              <p>Student Name: {cert.studentName}</p>
              <p>Certificate Type: {cert.certificateType}</p>
              <p>Issue Date: {new Date(cert.issueDate).toLocaleDateString()}</p>
              <p>Description: {cert.description}</p>
              <p>File: {cert.fileName}</p>
            </div>
          ))
        )}
      </div>

      <button onClick={handleDownloadExcel}>Download Excel</button>
    </div>
  );
}

export default App;