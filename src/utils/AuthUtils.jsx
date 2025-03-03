import { setName, setRole, setUseremail } from "./Auth";

// src/utils/AuthUtils.js
export const verifyToken = async (token, navigate) => {
    if (!token) return false;
  
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
  
    try {
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/verify/`, requestOptions);
        const data = await response.json();
  
        if (data.role) {
            setRole(data.role);
            setName(data.name);
            setUseremail(data.email);
            return true;
        } else {
            localStorage.removeItem('token');
            return false;
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
  };
  