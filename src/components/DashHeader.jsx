// DashHeader.jsx
import React, { useEffect, useState } from 'react';
import { Button, Navbar, NavbarToggle, Popover } from 'flowbite-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaTimes, FaRobot, FaChartLine } from 'react-icons/fa';
import { verifyToken } from '../utils/AuthUtils';
import { allNotifications, readOneNotification, clearAllTheNotifications } from '../fetch/DashHeader';
import { fetchUseremail } from '../utils/Auth';
import { HiOutlineUserGroup, HiAnnotation } from 'react-icons/hi';

const DashHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    useEffect(() => {
        if (token) {
            verifyToken(token, navigate);
        }
    }, [navigate, token]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notificationData = await allNotifications();
                const reverseNotification = notificationData.reverse();
                setNotifications(reverseNotification);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    const handleClearNotification = async (index) => {
        const notificationToRemove = notifications[index];
        const file_name = notificationToRemove.split(" from ")[0];
        const emailfetch = notificationToRemove.split(" from ")[1].split(" ")[0];
        const email = fetchUseremail(); 
        const role = localStorage.getItem("role");
        const isAdmin = role === 'admin' || role === 'super_admin';
        const current_email = isAdmin ? emailfetch : email;
        try {
            await readOneNotification(file_name, current_email);
            setNotifications(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error clearing notification:', error);
        }
    };

    const handleClearAllNotifications = async () => {
        try {
            await clearAllTheNotifications();
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing all notifications:', error);
        }
    };

    const activeStyle = 'text-[rgb(217,119,87)] border-b-2 border-[rgb(217,119,87)]';
    const inactiveStyle = 'text-black hover:text-[rgb(217,119,87)]';

    return (
        <Navbar className='border-b-2 border-white shadow-custom-bottom bg-[rgb(249,243,241)]'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold
             text-black inline-flex mt-2'>
                {/* <span>
                    <img src="/assets/varphi final logo-01.png" alt='logo' className='m-0 w-[50px] h-[px] px-2' />
                </span> */}
                AskPert
            </Link>
            
            {/* Navigation Links (Moved from sidebar) */}
            <div className="flex-1 flex justify-end pr-5">
                <div className="hidden md:flex space-x-8">
                    <Link to='/dashboard?tab=dash' className={`flex items-center px-3 py-2 ${tab === 'dash' || !tab ? activeStyle : inactiveStyle}`}>
                        <FaRobot className="mr-2" />
                        Chat Interface
                    </Link>
                    
                    {localStorage.getItem('role') === 'super_admin' && (
                        <>
                            <Link to='/dashboard?tab=users' className={`flex items-center px-3 py-2 ${tab === 'users' ? activeStyle : inactiveStyle}`}>
                                <HiOutlineUserGroup className="mr-2" />
                                User Management
                            </Link>
                            <Link to='/dashboard?tab=requests' className={`flex items-center px-3 py-2 ${tab === 'requests' ? activeStyle : inactiveStyle}`}>
                                <HiAnnotation className="mr-2" />
                                Requested Files
                            </Link>
                            <Link to='/dashboard?tab=metrics' className={`flex items-center px-3 py-2 ${tab === 'metrics' ? activeStyle : inactiveStyle}`}>
                                <FaChartLine className="mr-2" />
                                Metrics
                            </Link>
                        </>
                    )}
                </div>
            </div>
            
            <div className='flex gap-2  '>
                {role !== 'admin' && (
                    <Popover aria-labelledby="notification-popover" 
                        content={
                            <div className="w-64 p-3 max-h-[69vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                <div className="mb-3 flex justify-between">
                                    <span className="font-semibold text-white">Notifications</span>
                                    <Button onClick={handleClearAllNotifications} color='gray' size={'22px'} className="text-xs text-blue-500 px-2">
                                        Clear All
                                    </Button>
                                </div>
                                <ul>
                                    {notifications.map((notification, index) => (
                                        <li key={index} className="mb-1 flex justify-between items-center">
                                            <span className="text-sm text-white p-3 break-all">{notification}</span>
                                            <FaTimes className="text-black-400 hover:text-red-500 cursor-pointer flex-shrink-0" onClick={() => handleClearNotification(index)} />
                                        </li>
                                    ))}
                                </ul>
                                {notifications.length === 0 && (
                                    <div className="text-sm text-gray-400">No new notifications</div>
                                )}
                            </div>
                        }
                    >
                        <Button className='w-15 h-10 hidden sm:inline 
                         hover:bg-[rgb(215,192,183)] 
                         bg-[rgb(217,119,87)] hover:text-[rgb(217,119,87)] text-white border-none' color='bg-[rgb(215,192,183)] ' pill>
                            <FaBell />
                            {notifications.length > 0 && (
                                <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
                                    {notifications.length}
                                </span>
                            )}
                        </Button>
                    </Popover>
                )}
                <NavbarToggle />
            </div>
        </Navbar>
    );
};

export default DashHeader;
