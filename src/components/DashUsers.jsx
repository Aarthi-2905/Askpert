import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { Button, Modal, Table, TextInput , Select} from 'flowbite-react';
import { HiOutlineExclamationCircle, HiSearch,HiX } from 'react-icons/hi';
import { deleteUser, editUserDetails, fetchUsers, addUser } from '../fetch/DashUsers';
import { useNavigate } from "react-router-dom";
import { setRole } from '../utils/Auth';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { verifyToken } from '../utils/AuthUtils';
import Toast from '../utils/Toast';

export function SearchBar({ globalFilter, setGlobalFilter }) {
    return (
        <div className="flex max-w-xs rounded-lg shadow-custom-bottom">
            <TextInput id="search" type="search" placeholder="Search users" value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value || undefined)} required icon={HiSearch}
            />
        </div>
    );
}
export default function DashUsers() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [editUser, setEditUser] = useState({ username: '', email: ''});
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    //Toggles the visibility of the password.
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    //Toggles the state of showPassword to show or hide the password.
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const handleAuthAndNotifications = () => {
            const token = localStorage.getItem('token');
            if (token) {
                verifyToken(token, navigate); // Run once on mount
            }
        };
        handleAuthAndNotifications(); // Call function on mount
    }, [navigate]); // Only run once when `navigate` changes.

    //Loads user data and displays success messages from localStorage on component mount.
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchUsers(); 
                if (!data) {
                    throw new Error('Network response was not ok');
                }
                setData(data);  
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setToast({
                    show: true,
                    message:  'Failed to fetch users:',
                    type: 'error'
                });
                autoCloseToast();
            } 
        }
        loadData();
        const editflashMessage = localStorage.getItem('editUser');
        if (editflashMessage) {
            localStorage.removeItem('editUser');
        }
    }, []);

    const columns = React.useMemo(
        () => [
            { Header: 'Date created', accessor: 'date' },
            { Header: 'Username', accessor: 'username' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Role', accessor: 'role' },
            {
                Header: 'Edit',
                Cell: ({ row }) => (
                <span className="font-medium text-green-500 hover:underline cursor-pointer"
                    onClick={() => openConfirmModal({ type: 'edit', details:row.original })}
                    data-testid="Edit">
                    Edit
                </span>
                ),
            },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                <span className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => openConfirmModal({ type: 'delete', details:  row.original })}
                    data-testid="Delete">
                    Delete
                </span>
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, canPreviousPage, 
            canNextPage, pageOptions,state: { pageIndex, globalFilter }, setGlobalFilter,  nextPage,
            previousPage,
    } = useTable(
            {
                columns,data,initialState: { pageIndex: 0, pageSize :6 },
            },
        useGlobalFilter, usePagination
    );

    // Check the type of data to differentiate actions
    const openConfirmModal = (data) => {
        if (typeof data === 'object' && data.type === 'delete') {
            // Handle delete modal
            setEmailToDelete(data.details.email);
            setIsConfirmModalOpen(true);
        } else if (typeof data === 'object' && data.type === 'edit') {
            // Handle edit modal
            setEditUser(data.details); 
            setIsEditModalOpen(true);
        } else if (typeof data === 'object' && data.type === 'add') {
            // Handle add user modal
            setIsAddUserModalOpen(true);
        } else {
            console.error('Unknown parameter type:', data);
        }
    };
    
    // Close modal function with dynamic behavior
    const closeConfirmModal = (type) => {
        switch (type) {
            case 'delete':
                setIsConfirmModalOpen(false);
                setEmailToDelete(null);
                break;
            case 'edit':
                setIsEditModalOpen(false);
                setEditUser({ username: '', email: '' });
                break;
            case 'add':
                setIsAddUserModalOpen(false);
                setNewUser({ username: '', email: '', password: '', confirmPassword: '' });
                break;
            default:
                break;
        }
    };

    const handleDelete = async () => {
        try {
            const data = await deleteUser(emailToDelete);
            if (!data) {
                throw new Error('Network response was not ok');
            }
            setData(prevData => prevData.filter(user => user.email !== emailToDelete));
            closeConfirmModal('delete');
            setToast({
                show: true,
                message: data.detail || 'deleted successfully',
                type: 'success'
            });
            autoCloseToast();
        } catch (error) {
            setToast({
                show: true,
                message:  'Failed to delete user',
                type: 'error'
            });
            autoCloseToast();
        }
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        setLoading(true);
        editUser.role = "user";
        if (editUser.email === '' || editUser.username === '') {
            setToast({
                show: true,
                message: 'Email and Username cannot be empty',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        try {
            const data = await editUserDetails(editUser);
            if (!data) {
                throw new Error('Network response was not ok');
            }
            localStorage.setItem('editUser', data.detail);
            sessionStorage.setItem('toastMessage', JSON.stringify({
                show: true,
                message: data.detail ||  'User added successfully',
                type: 'success'
            }));
            window.location.reload();
        } catch (error) {
            setToast({
                show: true,
                message:  'Failed to Update user details',
                type: 'error'
            });
            autoCloseToast();
        }finally {
            setLoading(false); // Set loading to false when action is done
        }
        closeConfirmModal('edit');
    };

    const handleAddUser = async (event) => {
        event.preventDefault();
        // Perform any necessary validation
        if (newUser.password !== newUser.confirmPassword) {
            setToast({
                show: true,
                message: 'Passwords do not match',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        newUser.role = "user";
        if (newUser.email === '' || newUser.username === '' || 
                newUser.password === '' || newUser.confirmPassword === '') {
            setToast({
                show: true,
                message: 'Email and Username cannot be empty',
                type: 'error'
            });
            autoCloseToast();
            return;
        }
        setLoading(true);
        try {
            newUser.added_date = "";
            const {confirmPassword, ...userWithoutConfirmPassword} = newUser;
            const data = await addUser(userWithoutConfirmPassword);
            setData((prevData) => [...prevData, data]);
            if(data.detail){
                sessionStorage.setItem('toastMessage', JSON.stringify({
                    show: true,
                    message: data.detail,
                    type: 'success'
                })); 
            }else{
                sessionStorage.setItem('toastMessage', JSON.stringify({
                    show: true,
                    message: data.error_detail.detail,
                    type: 'error'
                }));
                
            }
            window.location.reload(); 
        } catch (error) {
            setToast({
                show: true,
                message:  error,
                type: 'success'
            });
            autoCloseToast();
        }finally {
            setLoading(false); // Set loading to false when action is done
        }
        closeConfirmModal('add');
    };
    
    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000); // Auto-close after 10 seconds (10000ms)
    };

    useEffect(() => {
        const storedToast = sessionStorage.getItem('toastMessage');
        if (storedToast) {
            const toastData = JSON.parse(storedToast);
            setToast(toastData);
            sessionStorage.removeItem('toastMessage');
            autoCloseToast();
        }
    }, []);

    const renderLoadingSpinner = () => {
        if (!loading) return null;
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center  bg-gray-400 bg-opacity-50">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4  border-black"></div>
            </div>
        );
    };

    return (
        <div className="table-auto w-[73vw] md:mx-auto p-3 m-5 ">
            {renderLoadingSpinner()}
            <div className="flex justify-between mb-4">
                <Button gradientDuoTone="purpleToBlue" className="shadow-custom-bottom"
                    onClick={() => openConfirmModal({ type: 'add', details: {} })}>
                    Add User
                </Button>
                <SearchBar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            </div>
            <div className='justify-centre items-center mb-4'>
                <Toast toast={toast} setToast={setToast} />
            </div>
            <Table hoverable className="shadow-md " {...getTableProps()}>
                {/* <Table.Head>
                    {columns.map((col) => (
                        <Table.HeadCell key={col.accessor}>{col.Header}</Table.HeadCell>
                    ))}
                </Table.Head> */}
                <Table.Head>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Date Created</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>User Name</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Email</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Role</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Edit</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body {...getTableBodyProps()} className="divide-y">
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <Table.Row key={row.id}  className=" text-white  border-gray-700 bg-gray-800 
                                hover:bg-[rgb(168,224,255,1)] hover:text-black">
                                {row.cells.map((cell) => {
                                    const { key, ...cellProps } = cell.getCellProps(); // Destructure to remove the key
                                    return (
                                        <Table.Cell key={cell.column.id} {...cellProps}>
                                        {cell.render('Cell')}
                                        </Table.Cell>
                                    );
                                })}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            <div className="flex justify-end items-center mt-4 gap-3 text-white">
                <Button onClick={() => previousPage()} disabled={!canPreviousPage} 
                    gradientDuoTone="purpleToBlue"  outline>
                    Previous    
                </Button>
                <span> Page {pageIndex + 1} of {pageOptions.length} </span>
                <Button onClick={() => nextPage()} disabled={!canNextPage} 
                    gradientDuoTone="purpleToBlue" outline>
                    Next
                </Button>
            </div>

            <Modal show={isConfirmModalOpen} onClose={() =>closeConfirmModal('delete')} popup size="lg">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h1 className='text-black font-bold text-xl'>Delete File</h1>
                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 m-9 rounded-sm" role="alert">
                            <p className="font-bold">Be Warned</p>
                            <p>Something not ideal might be happening.</p>
                        </div>
                        <h3 className="mb-5 text-lg  text-black">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-4 m-5">
                            <Button color="failure" onClick={handleDelete}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={()=>closeConfirmModal('delete')}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={isEditModalOpen} onClose={()=>closeConfirmModal('edit')} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center p-5">
                        <form onSubmit={handleEdit}>
                            <h3 className="mb-5 text-lg  font-semibold text-black" aria-label='Edit User'>
                                Edit User
                            </h3>
                            <TextInput type='text' value={editUser.username} aria-label='username'  placeholder="username" className="mb-4"
                                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} required/>
                            <TextInput type='email' value={editUser.email} aria-label='email' placeholder="email" className="mb-4" disabled
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} required/>
                            <div className="flex justify-center gap-4">
                                <Button  gradientDuoTone="purpleToBlue" aria-label='Save Change' role='button' name='Save Change' type='submit'>
                                    Save Change
                                </Button>
                                <Button class="text-white bg-gradient-to-r from-red-400 via-red-500
                                    to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                                    focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                                    text-sm px-4  text-center" onClick={() =>closeConfirmModal('edit')} >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Add User Modal */}
            <Modal show={isAddUserModalOpen} onClose={() =>closeConfirmModal('add')} popup size="md" className='bg-slate-50'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center p-5">
                        <form onSubmit={handleAddUser}>
                            <h3 className="mb-5 text-lg  font-semibold text-gray-400" aria-label='Add User'>
                                Add User
                            </h3>
                            <TextInput type='text' value={newUser.username} aria-label='username' placeholder="username" className="mb-4"
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required/>
                            <TextInput type='email' value={newUser.email} aria-label='email' placeholder="email" className="mb-4"
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required/>
                            <div className="relative">
                                <TextInput type={showPassword ? "text" : "password"}
                                    placeholder="Password" value={newUser.password} id="password" className="mb-4"  
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required
                                />
                                <span onClick={handleTogglePassword}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2  text-black cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <div className="relative">
                                <TextInput type={showPassword ? "text" : "password"}
                                    placeholder="Confirm Password" value={newUser.confirmPassword} className="mb-4" 
                                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })} required
                                />
                                <span onClick={handleTogglePassword}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2  text-black cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <div className="flex justify-center gap-4 m-2 mt-7">
                                <Button gradientDuoTone="purpleToBlue" aria-label='submit' type='submit'>
                                    Add User
                                </Button>
                                <Button class="text-white bg-gradient-to-r from-red-400 via-red-500
                                    to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                                    focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                                    text-sm px-4  text-center" onClick={() =>closeConfirmModal('add')}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

