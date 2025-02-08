import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './styles.css';

const ImageToExcelConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    setError(null);

    // Generate previews for new files
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, {
            name: file.name,
            url: e.target.result
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleConvert = async () => {
    setIsConverting(true);
    setError(null);

    try {
      console.log("Converting....");
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData,
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSelectedFiles([]);
      setPreviews([]);

    } catch (error) {
      setError('Failed to convert files. Please try again.');
      console.error('Conversion failed:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:8000/download/');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificates.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      setError('Failed to download Excel file. Please try again.');
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="mt-3 mb-5 text-red-500 text-center hh">Certificate to Excel Converter</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8  text-center mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-600">Click to upload certificate images or drag and drop</span>
            <span className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG</span>
          </label>
        </div>

        {previews.length > 0 && (
          <div className="mb-6 text-center">
            <h2 className="font-semibold mb-4 fs-1">Uploaded Images:</h2>
            <div className="border border-gray-200 rounded p-4 m-4 bg-gray-50">
              <div className="h-96">
                <div className="row">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative bg-white m-2 p-2 rounded-lg shadow-sm border border-gray-200 w-25 h-20" >
                      <div className="aspect-w-16 aspect-h-9 m-2">
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-100 object-contain rounded bg-gray-10 "
                        />
                      </div>
                      <div className="d-flex items-center justify-content-around">
                        <p className="fs-2 text-gray-600 truncate max-w-[80%]">
                          {preview.name}
                        </p>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="p-1 hover:bg-red-100 rounded text-red-500 "
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-center">
          <button
            onClick={handleConvert}
            disabled={selectedFiles.length === 0 || isConverting}
            className={`p-2 m-3 rounded ${
              selectedFiles.length === 0 || isConverting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-black'
            }`}
          >
            {isConverting ? 'Converting...' : 'Convert to Excel'}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 m-3 bg-green-500 text-black rounded hover:bg-green-600"
          >
            Download Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageToExcelConverter;