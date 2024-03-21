import React, { useState, useEffect } from 'react';
import {
   // ChonkyActions,
   // FileBrowser,
   // FileContextMenu,
   // FileHelper,
   // FileList,
   // FileNavbar,
   // FileToolbar,
   // defineFileAction,
    FullFileBrowser,
    //FileBrowser,
    //FileNavbar,
    ChonkyActions,
    //ChonkyIconName,
    //ChonkyIconProps
} from 'chonky';
//import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const myFileActions = [
    ChonkyActions.UploadFiles,
    ChonkyActions.DownloadFiles,
    ChonkyActions.DeleteFiles,
    ChonkyActions.OpenParentFolder.button.icon
];
// const myAction = defineFileAction({
//     id: 'my_action',
//     button: {
//         name: 'Run My Action',
//         toolbar: true,
//         icon: ChonkyIconName.flash, // <----
//     },
// });

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
const GED = () => {
    const [files, setFiles] = useState([]);
    const [folderChain, setFolderChain] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch directory structure from the server
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
            
    },[]); 
    
    const fetchDirectoryStructure = async () => {
        // Example of fetching directory structure from an API endpoint
        const response = await fetch('http://localhost:3000/GED/all');
        if (!response.ok) {
            throw new Error('Failed to fetch directory structure');
        }
        
        const responseData = await response.json(); // Extract JSON data from response
        lastdir = responseData;
        return responseData;
    };

    const handleOpenSelection = async (action) => {
        console.log('action == ' + action.id)
        if (action.id === 'delete_files')
        {
            console.log('deeeleeeeteee !!!')
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
                        setFolderChain(responseData.folderChain);
                    }catch(error){
                        console.log('error == ' + error)
                    }
                }
            }
        }
        else if (action.id === 'open_parent_folder'){
            try{
                console.log('here', action);
                const pathh  = removeLastDir(lastdir);
                lastdir = pathh;
                console.log('pathh ==' + pathh)
                const response = await fetch('http://localhost:3000/GED/open',{
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pathh })
                });
                console.log('sent !!!!!!!!!!!!!!!')
                if (!response.ok) {
                        const errorMessage = await response.text();
                        console.error("Register failed:", response.statusText);
                        alert(errorMessage)
                }
                const responseData = await response.json(); // Extract JSON data from response
                console.log(responseData)
                setFiles(responseData.files);
                setFolderChain(responseData.folderChain);
        }
        catch(error){
            console.log('error == ' + error)
        }
        }
        else if (action.id === 'mouse_click_file' && action.payload.clickType === 'double') {
             console.log('opennnnn1')
            
            if (!action.payload.file.isDir) {
                console.log('open ittt 1 !!!' + action.payload.file.id)
                const pdff = action.payload.file.id;
                console.log('open ittt 2 !!!')
                try {
                    console.log('open pdf!')
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
                console.log('opennnnn2')

                const pathh  = action.payload.file.id;
                lastdir = pathh;
                console.log('pathh ==' + pathh)
                try{
                    
                    const response = await fetch('http://localhost:3000/GED/open',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pathh })
            });
            console.log('sent !!!!!!!!!!!!!!!')
            if (!response.ok) {
                throw new Error('Failed to fetch directory structure');
            }
            const responseData = await response.json(); // Extract JSON data from response
            console.log(responseData)
            setFiles(responseData.files);
            setFolderChain(responseData.folderChain);
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

    // const goback = async (action) => {
    //     try{

    //         console.log('here', action);
    //         const pathh  = lastdir;
    //         //lastdir = pathh;
    //         console.log('pathh ==' + pathh)
    //         try{
                
    //             const response = await fetch('http://localhost:3000/GED/open',{
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ pathh })
    //         });
    //         console.log('sent !!!!!!!!!!!!!!!')
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch directory structure');
    //         }
    //         const responseData = await response.json(); // Extract JSON data from response
    //         console.log(responseData)
    //         setFiles(responseData.files);
    //         setFolderChain(responseData.folderChain);
    //     }
    //     catch(error){
    //         console.log('error == ' + error)
    //     }
    // }
    // catch(error){
    //     console.log('error == ' + error)
    // }
    // }

    if (error) {
        return <div>Error: {error}</div>; // Render error message if an error occurred
    }

    return (
        <div style={{ height: 600, width: 1000 } } >
            <FullFileBrowser 
                files={files}
                //iconComponent={CustomIconSet}
                folderChain={folderChain}
                //fileActions={handleOpenSelection}
                onFileAction={handleOpenSelection}
                fileActions={myFileActions}                
            >
            </FullFileBrowser>
        </div>
    );
};

export default GED;
