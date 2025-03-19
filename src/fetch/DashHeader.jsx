// api.js
const getToken = () => localStorage.getItem('token');

// To get all the notifications for a specific user or Admin
export async function allNotifications() {
    const token = getToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/notifications/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data.detail.map(item => {
            if (item.from && item.status) {
                return `${item.file_name} from ${item.from} was ${item.status}`;
            } else {
                return `${item.file_name} from ${item.email}`;
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

// To delete a particular notification
export async function readOneNotification(file_name, email) {
    const token = getToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/notifications/read_one/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 'email' : email, 'file_name': file_name }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error);
    }
}

// To clear all notifications for a particular user
export async function clearAllTheNotifications() {
    const token = getToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/notifications/read_all/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error);
    }
}
