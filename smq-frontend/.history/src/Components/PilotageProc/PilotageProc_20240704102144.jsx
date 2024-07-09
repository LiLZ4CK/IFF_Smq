import './PilotageProc.css';
import React, { useState, useEffect } from 'react';
import { FaCaretDown, FaCaretRight } from 'react-icons/fa';

const PilotageProc = () => {
  const [fichier, setFichier] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [pdfPath, setPdfPath] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchFichier = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/Fichier/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setFichier(data.fichier);
        } else {
          console.error("Failed to fetch fichier:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFichier();
  }, []);

  const displayPdf = async (filePath, file) => {
    try {
      const response = await fetch('http://localhost:3000/Fichier/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: filePath })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Fetching PDF failed:", response.statusText);
        alert(errorMessage);
      } else {
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfPath(pdfUrl);
        setSelectedFile(file);
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const toggleGroupCollapse = (group) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  c

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('reda: ', selectedFile.redacteur)
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/Fichier/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ info: selectedFile })
      });

      if (response.ok) {
        window.location.href = 'http://localhost:8000/Pilotage_du_processus';
      } else {
        console.error('Failed to edit file:', response.statusText);
        // Handle error state or feedback to user
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error state or feedback to user
    }
  };

  // Filter files based on the search value
  const filteredFiles = fichier.filter(file => 
    file.path.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Group files by their group
  const groupedFiles = filteredFiles.reduce((acc, file) => {
    if (!acc[file.group]) acc[file.group] = [];
    acc[file.group].push(file);
    return acc;
  }, {});

  return (
    <div className="PilotageProc">
      <div className='piloback'>
      </div>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Rechercher" 
          value={filterValue} 
          onChange={(e) => setFilterValue(e.target.value)} 
        />
      </div>
      <div className="files-container">
        {Object.keys(groupedFiles).map((group) => (
          <div key={group} className="group-container">
            <div className="group-header" onClick={() => toggleGroupCollapse(group)}>
              {collapsedGroups[group] ? <FaCaretRight /> : <FaCaretDown />}
              <span>{group}</span>
            </div>
            {!collapsedGroups[group] && (
              <ul>
                {groupedFiles[group].map((file, index) => (
                  <li key={index}>
                    <a
                      href={file.path} // Use the correct file path directly
                      onClick={(e) => {
                        e.preventDefault();
                        displayPdf(file.path, file);
                      }}
                    >
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-details">
          <h3>Informations</h3>
          <form onSubmit={handleSubmit}>
            <div className="info-row">
              <label>Rédacteur:</label>
              <input type="text" name="redacteur" value={selectedFile.redacteur || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Créé le:</label>
              <input type="text" value={new Date(selectedFile.dateCreation).toLocaleDateString()} disabled />
            </div>
            <div className="info-row">
              <label>Type de document:</label>
              <input type="text" name="typeDoc" value={selectedFile.typeDoc || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Processus:</label>
              <input type="text" name="processus" value={selectedFile.processus || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Nature de document:</label>
              <input type="text" name="natureDoc" value={selectedFile.natureDoc || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Produits:</label>
              <input type="text" name="produit" value={selectedFile.produit || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Services:</label>
              <input type="text" name="service" value={selectedFile.service || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Complément:</label>
              <input type="text" name="compleme" value={selectedFile.compleme || ''} onChange={handleInputChange} />
            </div>
            <div className="info-row">
              <label>Commentaire:</label>
              <input type="text" name="commentaire" value={selectedFile.commentaire || ''} onChange={handleInputChange} />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      {pdfPath && (
        <div className="pdf-containerp">
          <iframe src={pdfPath} position="absolute" width="70%" height="160%" title="PDF Viewer"></iframe>
        </div>
      )}
    </div>
  );
};

export default PilotageProc;
