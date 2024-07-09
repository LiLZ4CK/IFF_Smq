import './AddFichier.css';
import React, { useState, useEffect } from 'react';

const AddFichier = () => {
    const [responsables, setResponsables] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [pdfFile, setPdfFile] = useState(null);
    const [redacteur, setRedacteur] = useState("");
    const [group, setGroup] = useState("");
    const [typeDoc, setTypeDoc] = useState("");
    const [processus, setProcessus] = useState("");
    const [natureDoc, setNatureDoc] = useState("");
    const [produit, setProduit] = useState("");
    const [service, setService] = useState("");
    const [compleme, setCompleme] = useState("");
    const [commentaire, setCommentaire] = useState("");

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/proc/list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setProcesses(data.procs);
                }
            } catch (error) {
                console.error('Error fetching processes:', error);
            }
        };

        const fetchResponsables = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/nconf/resp', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setResponsables(data.resp);
                }
            } catch (error) {
                console.error('Error fetching responsables:', error);
            }
        };

        fetchProcesses();
        fetchResponsables();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            alert('Please upload a valid PDF file.');
        }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!pdfFile) {
          alert('Please upload a PDF file.');
          return;
      }
  
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('redacteur', redacteur);
      formData.append('typeDoc', typeDoc);
      formData.append('processus', processus);
      formData.append('natureDoc', natureDoc);
      formData.append('produit', produit);
      formData.append('service', service);
      formData.append('compleme', compleme);
      formData.append('commentaire', commentaire);
      formData.append('group', group);
  
      try {
          const token = localStorage.getItem('token');
          console.log('addfichier')
          const response = await fetch('http://localhost:3000/Fichier/new', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              body: formData
          });
          if (response.ok) {
              window.location.href = 'http://localhost:8000/Pilotage_du_processus';
          } else {
              const errorData = await response.json();
              console.error('Error submitting form:', errorData);
              alert('Error submitting form. Please try again.');
          }
      } catch (error) {
          console.error('Error submitting form:', error);
          alert('Error submitting form. Please try again.');
      }
  };
    return (
        <div className="AddFichier">
            <div className='backgf'></div>
            <h1>Ajouter un fichier</h1>
            <fieldset>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="file">PDF File:</label>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} required />
                    </div>
                    <div>
                        <label htmlFor="redacteur">Redacteur:</label>
                        <select value={redacteur} onChange={(e) => setRedacteur(e.target.value)} required>
                            <option value="" disabled selected>Nom de Redacteur</option>
                            {responsables.map((rep, index) => (
                                <option key={index} value={rep.name}>
                                    {rep.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="processus">Processus:</label>
                        <select value={processus} onChange={(e) => setProcessus(e.target.value)} required>
                            <option value="" disabled selected>Nom de processus</option>
                            {processes.map((pros, index) => (
                                <option key={index} value={pros.name}>
                                    {pros.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="typeDoc">Type de document:</label>
                        <input type="text" value={typeDoc} onChange={(e) => setTypeDoc(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="group">Groupe:</label>
                        <select id="group" value={group} onChange={(e) => setGroup(e.target.value)} required>
                            <option value="" disabled selected>Groupe</option>
                            <option value="Confirmation">Confirmation</option>
                            <option value="Publication">Publication</option>
                            <option value="Rédaction">Rédaction</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="natureDoc">Nature de document:</label>
                        <input type="text" value={natureDoc} onChange={(e) => setNatureDoc(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="produit">Produit:</label>
                        <input type="text" value={produit} onChange={(e) => setProduit(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="service">Service:</label>
                        <input type="text" value={service} onChange={(e) => setService(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="compleme">Complémen:</label>
                        <input type="text" value={compleme} onChange={(e) => setCompleme(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="commentaire">Commentaire:</label>
                        <input type="text" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </fieldset>
        </div>
    );
};

export default AddFichier;
