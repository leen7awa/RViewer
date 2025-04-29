import React, { useState } from "react";
import axios from 'axios'


function App() {
  const serverLink = import.meta.env.VITE_API_URL;

  const [successMessage, setSuccessMessage] = useState('');

  // const [file, setFile] = useState('C:\lcTest.pdf');
  const [file, setFile] = useState();
  const [fileURL, setFileURL] = useState();

  const upload = () => {
    if (!file)
      alert("Select a file!")
    else {
      const formData = new FormData()
      formData.append('file', file);
      axios.post(`${serverLink}/upload`, formData)  //Builds a form payload (like a normal HTML file upload) and sends it to the backend.
        .then(res => {
          console.log(res.data);
          setSuccessMessage('File uploaded successfully!');
          setFileURL(res.data.url);
        })
        .catch(err => {
          console.log(err)
          setSuccessMessage('');
          setFileURL('');
        })
    }
  }

  function sendWhatsApp(phone, text) {
    const message = encodeURIComponent(text);
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
  }


  return (
    <div className="flex flex-col items-center justify-center h-svh space-y-24">
      <input className="border p-2 w-fit bg-slate-200" type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={() => { sendWhatsApp('+972502254231', 'שלום! מחכה לך קבלה מלין מחשבים') }}
      >Send</button>

      <button className="border p-2 w-fit bg-slate-200" type="button" onClick={upload}>upload</button>
      {successMessage && <div className="text-green-600 mt-2">{successMessage}</div>}

      {fileURL && (
        <a
          href={fileURL}
          target="_blank"
          rel="noopener noreferrer"
          className="border p-2 bg-blue-500 text-white rounded"
        >
          View Uploaded File
        </a>
      )}
    </div>
  );
}

export default App;
