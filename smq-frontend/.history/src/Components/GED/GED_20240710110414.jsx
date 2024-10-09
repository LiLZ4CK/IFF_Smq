import React, { useState, useEffect } from 'react';
import { TiArrowBack } from "react-icons/ti";

import './GED.css';
import * as XLSX from 'xlsx';
import { FullFileBrowser, ChonkyActions } from 'chonky';

const myFileActions = [
  ChonkyActions.UploadFiles,
  ChonkyActions.DownloadFiles,
  ChonkyActions.DeleteFiles,
  ChonkyActions.SortFilesByName,
  ChonkyActions.OpenParentFolder,
  ChonkyActions.EnableListView,
];

const tools = [
  ChonkyActions.OpenParentFolder.button.contextMenu = true,
  ChonkyActions.OpenParentFolder.button.toolbar = true,
  ChonkyActions.OpenParentFolder.button.iconOnly = false,
  ChonkyActions.OpenParentFolder.button.
];

function removeLastDir(path) {
  if (!path) {
    return path;
  }

  const lastDirSeparatorIndex = Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'));
  if (lastDirSeparatorIndex !== -1) {
    return path.slice(0, lastDirSeparatorIndex);
  }

  return path;
}

let lastdir = '';

const GED = () => {
  const [files, setFiles] = useState([]);
  const [pdfPath, setPdfPath] = useState("");
  const [xlsxData, setXlsxData] = useState([]);
  const [folderChain, setFolderChain] = useState([]);

  useEffect(() => {
    fetchDirectoryStructure()
      .then(data => {
        setFiles(data.files);
        setFolderChain(data.folderChain);
        lastdir = ''; // Initialize lastdir to root on first load
      })
      .catch(error => {
        console.error('Error fetching directory structure:', error);
      });
  }, []);

  const fetchDirectoryStructure = async () => {
    const response = await fetch('http://localhost:3000/GED/all');
    if (!response.ok) {
      throw new Error('Failed to fetch directory structure');
    }
    const responseData = await response.json();
    setFolderChain(responseData.folderChain);
    setFiles(responseData.files);
    return responseData;
  };

  const goBack = async () => {
    try {
      const pathh = removeLastDir(lastdir);
      lastdir = pathh;
      const response = await fetch('http://localhost:3000/GED/back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathh })
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Failed to open parent folder:", response.statusText);
        alert(errorMessage)
      }
      const responseData = await response.json();
      setFiles(responseData.files);
      setFolderChain(responseData.folderChain);
    } catch (error) {
      console.error('Error opening parent folder:', error)
    }
  };

  const handleOpenSelection = async (action) => {
    console.log('Action triggered:', action);
    if (action.id === 'delete_files') {
      if (action.state.selectedFiles.length !== 1) {
        alert('You can delete just one file at a time');
      } else {
        if (!action.state.contextMenuTriggerFile.isDir) {
          try {
            const file = action.state.contextMenuTriggerFile.id;
            const response = await fetch('http://localhost:3000/GED/del/file', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file })
            });
            if (!response.ok) {
              const errorMessage = await response.text();
              console.error("Delete failed:", response.statusText);
              alert(errorMessage)
            }
            const responseData = await response.json();
            setFiles(responseData.files);
          } catch (error) {
            console.error('Error deleting file:', error)
          }
        }
      }
    } else if (action.id === 'open_parent_folder') {
      goBack();
    } else if (action.id === 'mouse_click_file' && action.payload.clickType === 'double') {
      if (!action.payload.file.isDir) {
        const file = action.payload.file.id;
        const fileExtension = file.split('.').pop().toLowerCase();
        console.log('File clicked:', file, 'Extension:', fileExtension);

        if (fileExtension === 'pdf') {
          try {
            const response = await fetch('http://localhost:3000/GED/pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file })
            });

            if (!response.ok) {
              const errorMessage = await response.text();
              console.error("Fetching PDF failed:", response.statusText);
              alert(errorMessage)
            } else {
              const pdfBlob = await response.blob();
              const pdfUrl = URL.createObjectURL(pdfBlob);
              setPdfPath(pdfUrl);
              console.log('pdf= ', pdfUrl)
              setXlsxData([]); // Clear XLSX data when displaying a PDF
            }
          } catch (error) {
            console.error('Error fetching PDF:', error)
          }
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          try {
            const response = await fetch('http://localhost:3000/GED/xlsx', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file })
            });

            if (!response.ok) {
              const errorMessage = await response.text();
              console.error("Fetching XLSX failed:", response.statusText);
              alert(errorMessage)
            } else {
              const xlsxBlob = await response.blob();
              const arrayBuffer = await xlsxBlob.arrayBuffer();
              const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              setXlsxData(jsonData);
              setPdfPath(""); // Clear PDF path when displaying XLSX data
            }
          } catch (error) {
            console.error('Error fetching XLSX:', error)
          }
        }
      } else {
        const pathh = action.payload.file.id;
        lastdir = pathh;
        try {
          const response = await fetch('http://localhost:3000/GED/open', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pathh })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch directory structure');
          }
          const responseData = await response.json();
          setFiles(responseData.files);
          setFolderChain(responseData.folderChain);
        } catch (error) {
          console.error('Error opening folder:', error)
        }
      }
    }
  };

  return (
    <div>
      <div className='backdocv'>
      </div>
      <div className='chonky'>
        <FullFileBrowser
          files={files}
          folderChain={folderChain}
          defaultSortActionId={'Name'}
          defaultFileViewActionId={ChonkyActions.EnableListView.id}
          onFileAction={handleOpenSelection}
          fileActions={myFileActions}
          toolbar={tools}
          button={tools}
        >
        </FullFileBrowser>
          
      </div>
      {pdfPath && (
        <div className="pdf-containera">
          <iframe src={pdfPath} position="absolute" width="100%" height="150%" title="PDF Viewer"></iframe>
        </div>
      )}
      {xlsxData.length > 0 && (
        <div className="xlsx-container">
          <table>
            <thead>
              <tr>
                {Object.keys(xlsxData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {xlsxData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className='arrowback' onClick={goBack}><TiArrowBack /></button>
    </div>
  );
};

export default GED;
