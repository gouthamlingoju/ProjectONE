import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css"; // Import CSS file here
import * as XLSX from "xlsx";
document.addEventListener("DOMContentLoaded", () => {
  const certificateForm = document.getElementById("certificateForm");
  const certificateList = document.getElementById("certificateList");
  const downloadExcelBtn = document.getElementById("downloadExcel");

  // Load certificates on page load
  loadCertificates();

  // Handle form submission
  certificateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("certificateFile");
    const file = fileInput.files[0];

    if (!file) {
      app.showToast("Please select a file", "error");
      return;
    }

    // Validate file size
    if (!app.validateFileSize(file)) {
      app.showToast(
        `File size must be less than ${app.formatFileSize(app.MAX_FILE_SIZE)}`,
        "error"
      );
      return;
    }

    // Validate file type
    if (!app.validateFileType(file)) {
      app.showToast("Please upload a PDF or image file", "error");
      return;
    }

    try {
      // Convert file to base64
      const base64String = await fileToBase64(file);

      const certificateData = {
        studentName: document.getElementById("studentName").value,
        certificateType: document.getElementById("certificateType").value,
        issueDate: document.getElementById("issueDate").value,
        description: document.getElementById("description").value,
        fileName: file.name,
        fileData: base64String.split(",")[1],
      };

      await app.uploadCertificate(certificateData);
      app.showToast("Certificate uploaded successfully");
      certificateForm.reset();
      loadCertificates();
    } catch (error) {
      app.showToast("Failed to upload certificate", "error");
      console.error("Upload error:", error);
    }
  });

  // Handle Excel download
  downloadExcelBtn.addEventListener("click", () => {
    downloadExcel();
  });

  async function loadCertificates() {
    try {
      const certificates = await app.getCertificates();
      renderCertificates(certificates);
    } catch (error) {
      app.showToast("Failed to load certificates", "error");
      console.error("Load error:", error);
    }
  }

  function renderCertificates(certificates) {
    certificateList.innerHTML =
      certificates.length === 0
        ? '<p class="text-muted">No certificates uploaded yet</p>'
        : certificates
            .map(
              (cert) => `
              <div class="certificate-card">
                  <div class="card-header">
                      <span class="card-title">${cert.studentName}</span>
                      <button onclick="app.downloadFile('${cert.fileData}', '${
                cert.fileName
              }')" 
                              class="btn btn-secondary">
                          <span class="btn-icon">📥</span>
                          Download
                      </button>
                  </div>
                  <div class="card-content">
                      <dl>
                          <dt>Certificate Type</dt>
                          <dd>${cert.certificateType}</dd>
                          
                          <dt>Issue Date</dt>
                          <dd>${new Date(
                            cert.issueDate
                          ).toLocaleDateString()}</dd>
                          
                          ${
                            cert.description
                              ? `
                              <dt>Description</dt>
                              <dd>${cert.description}</dd>
                          `
                              : ""
                          }
                          
                          <dt>File</dt>
                          <dd>📄 ${cert.fileName}</dd>
                      </dl>
                  </div>
              </div>
          `
            )
            .join("");
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  function downloadExcel() {
    app.generateExcelFile().then((excelData) => {
      const blob = new Blob([excelData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "certificates.xlsx";
      link.click();
    });
  }
});
