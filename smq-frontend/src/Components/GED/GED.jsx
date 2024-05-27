import React, { useState, useEffect } from 'react';
import './GED.css';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { initializeApp } from "firebase/app"; 
import { getStorage, ref, getDownloadURL  } from "firebase/storage";// Import the Storage module
import {
  FullFileBrowser,
  ChonkyActions,
  ChonkyIconName,
} from 'chonky';

const myFileActions = [
  ChonkyActions.UploadFiles,
  ChonkyActions.DownloadFiles,
  ChonkyActions.DeleteFiles,
  ChonkyActions.OpenParentFolder
];
const tools = [
  ChonkyActions.OpenParentFolder.button.contextMenu = true,
  ChonkyActions.OpenParentFolder.button.toolbar = true,
  ChonkyActions.OpenParentFolder.button.iconOnly = false,
  ChonkyActions.OpenParentFolder.button.icon = ChonkyIconName.openParentFolder,
];

function removeLastDir(path) {
  if (!path) {
    return path; // Handle empty path case (optional)
  }

  // Handle paths ending with a single backslash (\)
  if (path.endsWith('\\')) {
    return path.slice(0, -1);
  }

  const lastDirSeparatorIndex = path.lastIndexOf('\\');
  if (lastDirSeparatorIndex !== -1) {
    return path.slice(0, lastDirSeparatorIndex);
  }

  // If no directory separators are found, return the original path
  // (assuming it might not be a Windows path)
  return path;
}
let lastdir;
// **No need for getStorage or getDownloadURL here anymore**

const GED = () => {
  const [docData, setDocData] = useState(null);
  const [files, setFiles] = useState([]);
  const [folderChain, setFolderChain] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDirectoryStructure()
            .then(data => {
                // Assuming data is in the format of files and folderChain
                setFiles(data.files);
                setFolderChain(data.folderChain);
            })
            .catch(error => {
                console.error('Error fetching directory structure:', error);
                setError(error.message); // Set error state with the error message
            });

    const fetchDocument = async () => {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyB6wZwbROZgKLCVMQpYrQ24L9KWV1UMuag",
          authDomain: "smqf-7cd0f.firebaseapp.com",
          databaseURL: "https://smqf-7cd0f-default-rtdb.europe-west1.firebasedatabase.app",
          projectId: "smqf-7cd0f",
          storageBucket: "smqf-7cd0f.appspot.com",
          messagingSenderId: "272572371299",
          appId: "1:272572371299:web:04d77f454598c111738356",
          measurementId: "G-XNZ0W4LTTB"
        };

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const pdfRef = ref(storage, '/pdf/Presentation_AKUMENIA.pdf');
        const url = await getDownloadURL(pdfRef);

        setDocData(url);

        console.log('url ==' + url)
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchDocument();
  }, []);
    
    const fetchDirectoryStructure = async () => {
      // Example of fetching directory structure from an API endpoint
      const response = await fetch('http://localhost:3000/GED/all');
      if (!response.ok) {
          throw new Error('Failed to fetch directory structure');
      }
      
      const responseData = await response.json(); // Extract JSON data from response
      setFolderChain(responseData.folderChain);
      return responseData;
  };

  const handleOpenSelection = async (action) => {
      if (action.id === 'delete_files')
      {
          if (action.state.selectedFiles.length !== 1){
              alert('you can delete just one file everytime')
          }
          else{
              if (!action.state.contextMenuTriggerFile.isDir){ //del file
                  try{
                      const file = action.state.contextMenuTriggerFile.id;
                      const response = await fetch('http://localhost:3000/GED/del/file',{
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ file })});
                      if (!response.ok) {
                          const errorMessage = await response.text();
                          console.error("Register failed:", response.statusText);
                          alert(errorMessage)
                  }
                      const responseData = await response.json(); // Extract JSON data from response
                      //alert(responseData)
                      setFiles(responseData.files);
                      //setFolderChain(responseData.folderChain);
                      console.log('folder chain = ' + folderChain.length)
                  }catch(error){
                      console.log('error == ' + error)
                  }
              }
          }
      }
      else if (action.id === 'open_parent_folder'){
          try{
              const pathh  = removeLastDir(lastdir);
              lastdir = pathh;
              const response = await fetch('http://localhost:3000/GED/open',{
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ pathh })
              });
              if (!response.ok) {
                      const errorMessage = await response.text();
                      console.error("Register failed:", response.statusText);
                      alert(errorMessage)
              }
              const responseData = await response.json(); // Extract JSON data from response
              setFiles(responseData.files);
              //setFolderChain(responseData.folderChain);
              console.log('folder chain = ' + folderChain.length)
      }
      catch(error){
          console.log('error == ' + error)
      }
      }
      else if (action.id === 'mouse_click_file' && action.payload.clickType === 'double') {
          
          if (!action.payload.file.isDir) {
              const pdff = action.payload.file.id;
              try {
                  const response = await fetch('http://localhost:3000/GED/pdf', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ pdff })
                  });
      
                  if (!response.ok) {
                      const errorMessage = await response.text();
                      console.error("Fetching PDF failed:", response.statusText);
                      alert(errorMessage)
                  } else {
                      // Assuming the response is a Blob containing the PDF data
                      const pdfBlob = await response.blob();
                      const pdfUrl = URL.createObjectURL(pdfBlob);
                      
                      // Create a temporary anchor element
                      const anchorElement = document.createElement('a');
                      anchorElement.href = pdfUrl;
                      anchorElement.target = '_blank'; // Open in a new tab
                      anchorElement.click();
                      
                      // Clean up by revoking the URL object
                      URL.revokeObjectURL(pdfUrl);
                  }
              } catch (error) {
                  console.error('Error fetching PDF:', error)
              }
              return
          }
          else{

              const pathh  = action.payload.file.id;
              lastdir = pathh;
              try{
                  
                  const response = await fetch('http://localhost:3000/GED/open',{
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ pathh })
          });
          if (!response.ok) {
              throw new Error('Failed to fetch directory structure');
          }
          const responseData = await response.json(); // Extract JSON data from response
          setFiles(responseData.files);
          setFolderChain(responseData.folderChain);
          console.log('folder chain = ' + folderChain.length)
      }
      catch(error){
          console.log('error == ' + error)
      }
  }
      }
      else{
          console.log('nothing !')
      }
  };

  return (
    <div >
    <div className='backdocv'>
      </div>
      <div className='chonky'>
            <FullFileBrowser 
                files={files}
                //iconComponent={CustomIconSet}
                folderChain={folderChain}
                //fileActions={handleOpenSelection}
                onFileAction={handleOpenSelection}
                fileActions={myFileActions}
                toolbar={tools}
                button={tools}
            >
            </FullFileBrowser>

        </div>
    <div className='docv'>
      <DocViewer
        documents={[{
          uri: 'http://localhost:8000/48c626e0-d4b4-40f1-8ff6-52974bb8de5a',
          fileType: "pdf",
          fileName: "image"
        }]}
        pluginRenderers={DocViewerRenderers}
      />
    </div>
    </div>
  );
};

export default GED;