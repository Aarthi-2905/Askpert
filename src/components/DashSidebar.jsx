import React from 'react';
import { Sidebar, Modal, Button, TextInput } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiOutlineExclamationCircle, HiUserCircle, HiX } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHistory, FaPlus } from 'react-icons/fa';
import { fetchUseremail, logout } from "../utils/Auth";
import { Flowbite } from 'flowbite-react';
import Toast from '../utils/Toast';

const customTheme = {  
    sidebar: {    
        root: {      
            base: "h-full transition-all duration-300",      
            inner: "h-full overflow-y-auto overflow-x-hidden bg-[rgb(249,243,241)] py-4 text-white relative"    
        }  
    }
};

export default function DashSidebar() {
    const [tab, setTab] = useState('');
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    useEffect(() => {
        const storedToast = sessionStorage.getItem('toastMessage');
        if (storedToast) {
            const toastData = JSON.parse(storedToast);
            setToast(toastData);
            sessionStorage.removeItem('toastMessage');
            autoCloseToast();
        }
    }, []);

    const handleSignOut = () => {
        logout();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('useremail');
        localStorage.removeItem('role');
        setShowSignOutModal(false);
        navigate('/');
        localStorage.setItem('status','Signout Successfully');
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const updatedData = {
            username: username,
            email: email,
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/users/edit/profile`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (response) {
                const updatedData = await response.json();
                setShowProfileModal(false);
                sessionStorage.setItem('toastMessage', JSON.stringify({
                    show: true,
                    message: updatedData.detail,
                    type: 'success'
                }));
                autoCloseToast();
                window.location.reload();
            } else {
                sessionStorage.setItem('toastMessage', JSON.stringify({
                    show: true,
                    message: 'Failed to Update',
                    type: 'error'
                }));
                autoCloseToast();
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    const handleOpenProfileModal = () => {
        setUsername(localStorage.getItem('username') || '');
        setEmail(fetchUseremail() || '');
        setShowProfileModal(true);
    };

    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000);
    };
    
    const handleNewChat = () => {
        navigate('/dashboard?tab=dash');
        // Logic to start a new chat
        // You might want to reset conversation state here
    };

    const activeStyle = 'bg-gradient-to-r from-[rgba(249,243,241)] to-[rgba(217,119,87)] font-semibold text-black w-full rounded-none flex items-center text-black hover:bg-gray-200 p-2 rounded ';
    const inactiveStyle = 'hover:bg-gradient-to-r hover:from-[rgba(249,243,241)] hover:font-semibold hover:to-[rgba(217,119,87,1)] hover:text-black text-black rounded-none flex items-center text-black hover:bg-gray-200 p-2 rounded ';

    return (
        <>
            <Flowbite theme={{ theme: customTheme }}>
                <div className='justify-centre items-center mb-4'>
                    <Toast toast={toast} setToast={setToast} />
                </div>
                
                {/* Toggle button */}
                <div 
                    className={`absolute z-10 left-0 top-1/2 transform -translate-y-1/2 ${isExpanded ? 'left-64' : 'left-6'} transition-all duration-300`}
                    onMouseEnter={() => setIsExpanded(true)}
                >
                    <button className="bg-[rgb(217,119,87)] p-2 rounded-full shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isExpanded ? 
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> : 
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            }
                        </svg>
                    </button>
                </div>
                
                {/* <div 
                    className={`${isExpanded ? 'w-64' : 'w-0'} h-full transition-all duration-300 overflow-hidden`}
                    onMouseLeave={() => setIsExpanded(false)}
                > */}
                {/* <div 
                    className={`${isExpanded ? 'w-64' : 'w-0'}  top-16 left-0 z-30 
                     h-[calc(100vh-4rem)] bg-[rgb(249,243,241)] transition-all duration-300 overflow-hidden`}
                    onMouseLeave={() => setIsExpanded(false)}
                >
                    <Sidebar className='h-full bg-[rgb(249,243,241)]'>
                        <Sidebar.Items className='flex flex-col h-full justify-between'>
              
                            <Sidebar.ItemGroup className='flex flex-col gap-1 text-black'>
                                <Link to='/dashboard?tab=dash' onClick={handleNewChat}>
                                    <Sidebar.Item className={inactiveStyle}
                                        icon={() => <FaPlus style={{ color: 'rgb(217,119,87)', fontSize: '20px'}} />} as='div'>
                                        New Chat
                                    </Sidebar.Item>
                                </Link>
                                <Sidebar.Item className={inactiveStyle}
                                    icon={() => <FaHistory style={{ color: 'rgb(217,119,87)', fontSize: '20px'}} />} as='div'>
                                    History
                                </Sidebar.Item>
                            </Sidebar.ItemGroup>
                            
          
                            <Sidebar.ItemGroup className='flex flex-col gap-1 text-black mt-auto'>
                                <Sidebar.Item className={`${tab === 'profile' ? activeStyle : inactiveStyle}`}
                                    icon={() => <HiUser style={{ color: 'rgb(217,119,87)', fontSize: '24px'}} />}
                                    onClick={handleOpenProfileModal}>
                                    <div className="flex items-center justify-between w-full">
                                        <span>Profile</span>
                                        <span className="px-2 py-1 mr-2 text-xs font-medium bg-gray-700 text-white rounded">
                                            {localStorage.getItem('role')}
                                        </span>
                                    </div>
                                </Sidebar.Item>
                                <Sidebar.Item icon={() => <HiArrowSmRight style={{ color: 'rgb(217,119,87)', fontSize: '24px'}} />} 
                                    className={inactiveStyle}
                                    onClick={() => setShowSignOutModal(true)}>
                                    Sign Out
                                </Sidebar.Item>
                            </Sidebar.ItemGroup>
                        </Sidebar.Items>
                    </Sidebar>
                </div> */}
                  <div 
                    className={` top-16 left-0 z-30 h-[calc(100vh-4rem)] bg-[rgb(249,243,241)] 
                    transition-all duration-300 shadow-lg ${isExpanded ? 'w-64' : 'w-0'}`}
                    onMouseLeave={() => setIsExpanded(false)}
                >
                    {isExpanded && (
                        <div className="flex flex-col h-full justify-between py-6">
                            {/* Top section: Chat history & New chat */}
                            <div className="px-4">
                                <Button 
                                    onClick={handleNewChat}
                                    className="mb-4 w-full flex items-center justify-center bg-[rgb(217,119,87)] hover:bg-[rgb(197,99,67)]"
                                >
                                    <FaPlus className="mr-2" /> New Chat
                                </Button>
                                
                                <div className="mt-6">
                                    <h3 className="text-black font-medium mb-2">Chat History</h3>
                                    <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                                        <Link to="#" className={inactiveStyle}>
                                            <FaHistory className="mr-2 text-[rgb(217,119,87)]" />
                                            <span className="truncate">Recent Chat 1</span>
                                        </Link>
                                        <Link to="#" className={inactiveStyle}>
                                            <FaHistory className="mr-2 text-[rgb(217,119,87)]" />
                                            <span className="truncate">Recent Chat 2</span>
                                        </Link>
                                        {/* Add more history items as needed */}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bottom section: Profile & Sign out */}
                            <div className="mt-auto px-4">
                                <div className="border-t border-gray-300 pt-4 space-y-2">
                                    <div 
                                        onClick={handleOpenProfileModal} 
                                        className={inactiveStyle}
                                    >
                                        <HiUser  className="mr-2 text-[rgb(217,119,87)]" size={20} />
                                        Profile
                                    </div>
                                    <div 
                                        onClick={() => setShowSignOutModal(true)} 
                                        className={inactiveStyle}
                                    >
                                        <HiArrowSmRight className="mr-2 text-[rgb(217,119,87)]" size={20} />
                                        Sign Out
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <Modal show={showSignOutModal} onClose={() => setShowSignOutModal(false)} popup size='md'>
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center m-8 mr-1- ml-10'>
                            <h1 className='text-black font-bold text-xl'>Sign Out</h1>
                            <img src="/assets/signout.png" alt="signout Icon"
                                className="mx-auto m-8 mb-5 h-20 w-20 object-contain" 
                            />
                            <h3 className='mb-5 text-lg text-black'>
                                Are you sure you want to sign out?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleSignOut} aria-label='Sign Out'>
                                    Sign Out
                                </Button>
                                <Button color='gray' onClick={() => setShowSignOutModal(false)}>
                                    No, Cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={showProfileModal} onClose={() => setShowProfileModal(false)}
                    popup className="w-full lg:w-10/5">
                    <Modal.Header />
                    <Modal.Body className='flex flex-col items-center'>
                        <h1 className='my-1 text-center font-semibold text-3xl'>Profile</h1>
                        <div className='mb-5 self-center cursor-pointer shadow-md overflow-hidden 
                            rounded-full text-gray-500'>
                            <HiUserCircle className='w-24 h-24 text-black' />
                        </div>
                        <h3 className='mb-4 text-xl font-semibold text-black'>{username}</h3>
                        <form className='flex flex-col gap-4' onSubmit={handleSaveProfile}>
                            <div className='flex flex-col gap-5 w-full px-12'>
                                <div className='flex justify-between w-full'>
                                    <div className='flex flex-col w-1/2 pr-2'>
                                        <label className='text-left text-black font-bold'>Username:</label>
                                        <TextInput type='text' className="my-2" value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder='Username' required
                                        />
                                    </div>
                                    <div className='ml-10 flex flex-col w-1/2 pl-2'>
                                        <label className='text-left text-black font-bold'>Email:</label>
                                        <TextInput type='email' className="my-2" value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder='Email' required disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-center gap-4 mt-6'>
                                <Button color='success' type='submit' className='bg-customGreen'>
                                    Save Change
                                </Button>
                                <Button class="text-white bg-gradient-to-r from-red-400 via-red-500
                                    to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                                    focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                                    text-sm px-4 text-center" onClick={() => setShowProfileModal(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </Flowbite>
        </>
    );
}