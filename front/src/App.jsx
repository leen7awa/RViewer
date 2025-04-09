import React, { useState } from "react";
import axios from 'axios'


function App() {
  const serverLink = import.meta.env.VITE_API_URL;

  const [successMessage, setSuccessMessage] = useState('');

  const [file, setFile] = useState();

  const upload = () => {
    const formData = new FormData()
    formData.append('file', file);
    axios.post(`${serverLink}/upload`, formData)
      .then(res => {
        console.log(res.data);
        setSuccessMessage('File uploaded successfully!');
      })
      .catch(err => {
        console.log(err)
        // console.log("Upload error:", err.response?.data || err.message);
        setSuccessMessage('');
      })
  }

  return (
    <div className="flex flex-col items-center justify-center h-svh space-y-24">
      <input className="border p-2 w-fit bg-slate-200" type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="border p-2 w-fit bg-slate-200" type="button" onClick={upload}>upload</button>
      {successMessage && <div className="text-green-600 mt-2">{successMessage}</div>}
    </div>
  );
}

export default App;
