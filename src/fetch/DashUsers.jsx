// Get token from localStorage
const getToken = () => localStorage.getItem('token');

export async function addUser(currentRowData){
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/users/add/`,{
            method : 'POST',
            headers : {
                'content-type' : 'application/json',
                Authorization: "Bearer " + token,
            },
            body : JSON.stringify(currentRowData),
        });

        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error);
    }
}
export async function editUserDetails(currentRowData){
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/users/edit/`,{
            method : 'PUT',
            headers : {
                'content-type' : 'application/json',
                Authorization: "Bearer " + token,
            },
            body : JSON.stringify(currentRowData),
        });

        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error);
    }
}

export async function fetchUsers() {
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/users/`,{
            method : 'GET',
            headers : {
                'content-type' : 'application/json',
                Authorization: "Bearer " + token,
            },
        }); 
        if (!response) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error);
    }
}

export async function deleteUser(email){
    const token = getToken();
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/users/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error);
    }
}