// Get token from localStorage
const getToken = () => localStorage.getItem('token');

//Uploading files
export async function uploadFile(formData){
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/bulk/bulk_file_upload/`, {
            method: 'POST',
            headers : {
                Authorization: "Bearer " + token,
            },
            body : formData
        });
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error)
    }
  
}

//Asking response for user prompt.
export async function userPrompt(inputText){
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/rag/query/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ "query": inputText }),
        });
        const data = await response.json();
        return data;
    } catch(error){
        throw new Error(error);
    }
}

//time metrics
export async function sendQueryTotalTime (time_details){
    const json = JSON.stringify(time_details)
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/log_query/`, {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body : json
    });
}

export async function sendFileUploadTotalTime (time_details){
    const token = getToken();
    const json = JSON.stringify(time_details);
    const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/log_bulk_file_processing/`, {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body : json
    });
}