export async function loginUser(username, password) {
    try{
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/token/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(`grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`)
        });
    
        const data = await response.json();
        return data;
    }catch(error){
        throw new Error(error);
    }
}