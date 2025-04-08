import React, { useEffect, useState } from "react";
import axios from 'axios'
function App() {

  const [file, setFile] = useState();

  const upload = () => {
    const formData = new FormData()
    formData.append('file', file)
    axios.post(`${REACT_APP_API_URL}/upload`, formData)
      .then(res => { })
      .catch(err => console.log(err))
  }

  return (
    <div className="">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="button" onClick={upload}>upload</button>
    </div>
  );
}

export default App;
