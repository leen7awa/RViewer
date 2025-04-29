import React, { useState } from "react";
import axios from "axios";

function App() {
  const serverLink = import.meta.env.VITE_API_URL;
  const [successMessage, setSuccessMessage] = useState('');
  const [fileURL, setFileURL] = useState('');

  const uploadReceipt = () => {
    const userId = 12345; // Example userId (you can dynamically use logged-in user's ID)

    axios.post(`${serverLink}/uploadReceipt`, { userId })
      .then(res => {
        console.log(res.data);
        setSuccessMessage('Receipt uploaded successfully!');
        setFileURL(res.data.url);
      })
      .catch(err => {
        console.error(err);
        setSuccessMessage('');
        setFileURL('');
      });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <button 
        className="border p-3 bg-blue-500 text-white rounded"
        onClick={uploadReceipt}
      >
        Upload Receipt
      </button>

      {successMessage && <div className="text-green-600">{successMessage}</div>}

      {fileURL && (
        <a 
          href={fileURL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="border p-2 bg-green-500 text-white rounded"
        >
          View Receipt
        </a>
      )}
    </div>
  );
}

export default App;
