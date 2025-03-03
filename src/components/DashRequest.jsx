import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { Modal, Table, Button, TextInput } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiSearch, HiX } from 'react-icons/hi';
import { approveFile, fetchFiles, rejectFile } from '../fetch/DashRequest';
import { verifyToken } from '../utils/AuthUtils';
import { useNavigate } from 'react-router-dom';
import Toast from '../utils/Toast';

const MAX_TOTAL_SIZE = 100 * 1024 * 1024;

export function SearchBar({ globalFilter, setGlobalFilter }) {
    return (
        <div className="flex max-w-xs rounded-lg shadow-custom-bottom">
            <TextInput id="search" type="search" placeholder="Search files" value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value || undefined)} required icon={HiSearch}
            />
        </div>
    );
}

export default function DashRequest() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [totalSelectedSize, setTotalSelectedSize] = useState(0);
    const [modalState, setModalState] = useState({ isOpen: false, type: null }); // Combines modal states
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(false);

    // Toast auto-close function
    const autoCloseToast = () => {
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    // formating the file size
    const formatFileSize = (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2);
    };

    useEffect(() => {
        const handleAuthAndNotifications = () => {
            const token = localStorage.getItem('token');
            if (token) {
                verifyToken(token, navigate); 
            }
        };
        handleAuthAndNotifications(); 
    }, [navigate]); // Only run once when `navigate` changes.

    // Load data on mount
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetchFiles();
                const reverseFile = [...response].reverse();
                if (!response) throw new Error('Failed to fetch data');
                if(response.error_detail){
                    showToast(response.error_detail, 'error');
                    autoCloseToast();
                }else{
                    setData(reverseFile);
                }
            } catch (error) {
                showToast('Failed to fetch details', 'error');
            }
        }
        loadData();
    }, []);

    // Helper to show toast messages
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        autoCloseToast();
    };

    // File download logic
    const handleFileClick = async (file) => {
        try {
            const url = `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_WEB_PORT}/user_uploads/${file.file_name}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch file');

            const blob = await response.blob();
            const blobURL = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = blobURL;
            anchor.download = file.file_name;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(blobURL);
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    };

    const handleAction = async (actionType, files) => {
        setLoading(true);
        try {
            const response = actionType === 'approve' ? await approveFile(files) : await rejectFile(files);
            if (!response) {
                throw new Error(`Failed to ${actionType} file: ${files.join(", ")}`);
            }
            // Handle the response based on the action type
            let message = '';
            let toastType = 'success'; 
            let successCount = 0;
            let failedCount = 0;
            let alreadyExistCount = 0;

            response.forEach((item) => {
                if (item.successful_files) {
                    const successFiles = item.successful_files.files;
                    if (successFiles.length > 0) {
                        message += `<span style="color: green;">Success (${actionType}): ${successFiles.join(', ')}</span><br>`;
                        successCount += successFiles.length;
                    }
                }
                
                if (item.failed_files) {
                    const failedFiles = item.failed_files.files;
                    if (failedFiles.length > 0) {
                        message += `<span style="color: red;">Failed (${actionType}): ${failedFiles.join(', ')}</span><br>`;
                        failedCount += failedFiles.length;
                    }
                }
                
                if (actionType === 'approve' && item.files_already_exist) {
                    const existingFiles = item.files_already_exist.files;
                    if (existingFiles.length > 0) {
                        message += `<span style="color: red;">Already Exist (${actionType}): ${existingFiles.join(', ')}</span>`;
                        alreadyExistCount += existingFiles.length;
                    }
                }

                // Determine the overall toast type
                if (successCount === 0 && (failedCount > 0 || alreadyExistCount > 0)) {
                    toastType = 'error'; 
                }
            });
             showToast(message.trim(), toastType);
    
            // Remove successfully approved/rejected files from the state
            const successFiles = response.filter(item => item.successful_files).flatMap(item => item.successful_files.files);
            setData(prevData => prevData.filter(file => !successFiles.includes(file.file_name)));
            setSelectedFiles([]);
            setTotalSelectedSize(0);
        } catch (error) {
            showToast(`Error ${actionType} files.`, 'error');
        } finally {
            setLoading(false);
            setModalState({ isOpen: false, type: null, files: [] });
        }
    };

    // Restore toast message from sessionStorage
    useEffect(() => {
        const storedToast = sessionStorage.getItem('toastMessage');
        if (storedToast) {
            const toastData = JSON.parse(storedToast);
            setToast(toastData);
            sessionStorage.removeItem('toastMessage');
            autoCloseToast();
        }
    }, []);

    // Modal open/close logic
    const openModal = (type, files = []) => {
        setModalState({ isOpen: true, type, files });
    };
    
    const closeModal = () => setModalState({ isOpen: false, type: null,files: [] });

    // Table columns
    const columns = useMemo( 
        () => [
            {
                Header: 'Select',
                accessor: 'select',
                Cell: ({ row }) => (
                    <input
                        type="checkbox"
                        className='cursor-pointer'
                        checked={selectedFiles.includes(row.original.file_name)} // Check if file is selected
                        onChange={() => toggleFileSelection(row.original.file_name,row.original.file_size_bytes)} // Toggle selection on click
                    />
                ),
            },
            {
                Header: 'Requested Files',
                accessor: 'file_name',
                Cell: ({ row }) => (
                    <span
                        className="cursor-pointer text-blue-500 hover:underline"
                        onClick={() => handleFileClick(row.original)}
                    >
                        {row.original.file_name}
                    </span>
                ),
            },
            { Header: 'User Name', accessor: 'email' },
            {
                Header: 'Approve',
                Cell: ({ row }) => (
                    <Button
                        className="bg-customGreen hover:bg-customGreen text-white"
                        onClick={() => openModal('approve', [row.original.file_name])}
                        data-testid="approve-button"
                    >
                        Approve
                    </Button>
                ),
            },
            {
                Header: 'Reject',
                Cell: ({ row }) => (
                    <Button
                        className="bg-customRed hover:bg-customRed text-white"
                        onClick={() => openModal('reject', [row.original.file_name])}
                        data-testid="reject-button"
                    >
                        Reject
                    </Button>
                ),
            },
        ],
        [selectedFiles] 
    );    

    // add/remove files from the selectedFiles
    const toggleFileSelection = (fileName,FileSize) => {
        setSelectedFiles((prevSelected) => {
           
            const isSelected = prevSelected.includes(fileName);
            if (isSelected) {
                setTotalSelectedSize(prev => prev - FileSize);
                return prevSelected.filter((name) => name !== fileName);
            } else {
                const newTotalSize = totalSelectedSize + FileSize;
                if (newTotalSize > MAX_TOTAL_SIZE) {
                    showToast(`Cannot select more files. Total size would exceed 100MB. Current: ${formatFileSize(totalSelectedSize)}MB`, 'error');
                    return prevSelected;
                }
                setTotalSelectedSize(newTotalSize);
                return [...prevSelected, fileName];
            }
        });
    };

    const {
        getTableProps, getTableBodyProps, prepareRow, page,
        state: { globalFilter, pageIndex }, nextPage, previousPage,
        canPreviousPage, canNextPage, pageOptions, setGlobalFilter,
    } =  useTable(
        {
            columns,data: data || [], initialState: { pageIndex: 0, pageSize :5 },
        },
        useGlobalFilter,
        usePagination
    );

    // Modal render function
    const renderModal = () => {
        if (!modalState.isOpen) return null;
        const actionText = modalState.type === 'approve' ? 'Approve' : 'Reject';
        return (
            <Modal show onClose={closeModal} popup size="lg" >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-black mb-4 mx-auto " />
                        <h1 className="text-black font-bold text-xl">{actionText} Files</h1>
                        <h3 className="mb-5 text-lg font-semibold text-black">
                            Are you sure you want to {actionText} these files?
                        </h3>
                        <ul className="text-black">
                            {modalState.files.map((file) => (
                                <li key={file}>{file}</li>
                            ))}
                        </ul>
                        <div className="flex justify-center gap-4 mt-5">
                            <Button
                                className={actionText === 'Approve' ? 'bg-customGreen text-white' : 'bg-customRed text-white'}
                                onClick={() => handleAction(modalState.type, modalState.files)}
                                disabled={loading}
                            >
                                Yes, {actionText}
                            </Button>
                            <Button color="gray" onClick={closeModal}>
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    };
      

    const renderLoadingSpinner = () => {
        if (!loading) return null;

        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center  bg-gray-400 bg-opacity-50">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4  border-black"></div>
            </div>
        );
    };

    return (
        <div className='table-auto w-[70vw]  justify-center md:mx-auto p-3  mb-10 '>
              {renderLoadingSpinner()}
            <Toast toast={toast} setToast={setToast} />
            <div className='flex justify-end mb-4 mt-5'>
                <SearchBar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            </div>
            <div className="overflow-auto max-h-[60vh] ">
                <Table hoverable className='shadow-custom-bottom rounded-lg' {...getTableProps()}>
                    <Table.Head>
                        {columns.map((col) => (
                            <Table.HeadCell  className='bg-gray-700 text-white' key={col.accessor || col.Header}>{col.Header}</Table.HeadCell>
                        ))}
                    </Table.Head>
                    <Table.Body {...getTableBodyProps()} className="divide-y">
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                            <Table.Row key={row.id} className=" text-white  border-gray-700 bg-gray-800 
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
            </div>
            

            <div className='flex justify-between items-center mt-4 text-white'>
                {/* Left Section: Approve & Reject */}
                <div className='flex items-center gap-3'>
                    <Button  className="bg-green-500 text-white" onClick={() => openModal('approve', selectedFiles)}
                        disabled={selectedFiles.length === 0}>
                        Approve Selected
                    </Button>
                    <Button className="bg-red-500 text-white" onClick={() => openModal('reject', selectedFiles)}
                        disabled={selectedFiles.length === 0}>
                        Reject Selected
                    </Button>
                </div>

                {/* Right Section: Pagination */}
                <div className='flex items-center gap-3'>
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage} gradientDuoTone="purpleToBlue" outline>
                        Previous
                    </Button>
                    <span> Page {pageIndex + 1} of {pageOptions.length} </span>
                    <Button onClick={() => nextPage()} disabled={!canNextPage} gradientDuoTone="purpleToBlue" outline>
                        Next
                    </Button>
                </div>
            </div>
            {renderModal()}
        </div>
    );
}

