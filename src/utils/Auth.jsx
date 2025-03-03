
export const setToken = (token) => {
    localStorage.setItem('token', token)
} 

export const setName = (username) => {
    localStorage.setItem('username', username);
};

export const setUseremail = (useremail) => {
    localStorage.setItem('useremail', useremail);
};

export const setRole = (role) => {
    localStorage.setItem('role', role);
}

export const setStatus = (status) => {
    localStorage.setItem('status', status);
}

export const fetchToken = () => {
    return localStorage.getItem('token')
}

export const fetchUsername = () => {
    return localStorage.getItem('username')
}

export const fetchUseremail = () => {
    return localStorage.getItem('useremail')
}

export const fetchRole = () => {
    return localStorage.getItem('role')
}

export const fetchStatus = () => {
    return localStorage.getItem('status')
}

export async function logout() {
    const logoutTimestamp = Date.now(); // Capture logout time

    // Retrieve login time (from state or local storage)
    const storedLoginTime = localStorage.getItem('loginTime');
    const user_email =localStorage.getItem('useremail');
    // Calculate duration
    const duration = logoutTimestamp - storedLoginTime;
    const durationInSeconds = duration / 1000;
    await sendUsersessionTotalTime({ user_email: user_email, total_time: durationInSeconds });
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    localStorage.removeItem('role');
    localStorage.removeItem('status');
    localStorage.removeItem('loginTime');
}
const getToken = () => localStorage.getItem('token');
export async function sendUsersessionTotalTime (time_details){
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/log_user_session/`, {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body : JSON.stringify(time_details) 
    });
    if (!response.ok) {
        throw new Error('Failed to add the Time');
    }
}



