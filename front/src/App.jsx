import React, { useState } from "react";
import axios from "axios";

function App() {
  const serverLink = import.meta.env.VITE_API_URL;
  const [successMessage, setSuccessMessage] = useState('');
  const [fileURL, setFileURL] = useState('');

  const uploadReceipt = async () => {
    const userId = 12345; // Replace with dynamic user ID if needed

    try {
      const res = await axios.post(`${serverLink}/uploadReceipt`, { userId });

      const shortUrl = res.data.url;
      setSuccessMessage('Receipt uploaded successfully!');
      setFileURL(shortUrl);

      const phoneNumber = '+972502254239;';
      const messageText = 'שלום! מחכה לך קבלה מלין מחשבים ב';

      const finalMessage = encodeURIComponent(`${messageText} ${shortUrl}`);

      const micropayURL = `https://www.micropay.co.il/extApi/scheduleSms.php?get=1&token=1vRI5880ea2d04f807d0b85b0ff23936499d&msg=${finalMessage}&from=Leen Computers&list=${phoneNumber}`;

      const newWindow = window.open(micropayURL, '_blank');
      if (newWindow) {
        setTimeout(() => newWindow.close(), 1000); // Try to auto-close the tab after 1 second
      }
    } catch (err) {
      console.error('Upload or SMS failed', err);
      setSuccessMessage('');
      setFileURL('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <button
        className="border p-3 bg-blue-500 text-white rounded"
        onClick={uploadReceipt}
      >
        Send Receipt
      </button>

      {successMessage && <div className="text-green-600">{successMessage}</div>}
    </div>
  );
}

export default App;
