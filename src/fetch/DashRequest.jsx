// Get token from localStorage
const getToken = () => localStorage.getItem('token');

export async function fetchFiles() {
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/rag/file_request/`,{
            method : 'GET',
            headers : {
                'content-type' : 'application/json',
                // Authorization: "Bearer " + token,
            },
        }); 

        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error);
    }
}

export async function approveFile(filename) {
    const json = JSON.stringify(filename);
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/bulk/bulk_file_accept/`,{
            method : 'POST',
            headers : {
                'content-type' : 'application/json',
                // Authorization: "Bearer " + token,
            },
            body : json
        }); 
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error);
    }
}

export async function rejectFile(filename) {
    const json = JSON.stringify(filename);
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/bulk/bulk_file_reject/`,{
            method : 'POST',
            headers : {
                'content-type' : 'application/json',
                // Authorization: "Bearer " + token,
            },
            body : json
        }); 

        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error);
    }
}