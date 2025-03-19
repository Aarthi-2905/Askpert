import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaUserCircle, FaRobot, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { Button, Textarea,Popover } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { sendFileUploadTotalTime, sendQueryTotalTime, uploadFile, userPrompt } from '../fetch/DashboardComp';
import { verifyToken } from '../utils/AuthUtils';
import Toast from '../utils/Toast';

const DashboardComp = () => {
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const fileInputRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [eventSource, setEventSource] = useState(null);
    const loginStatus = localStorage.getItem('status');

    const [isThinking, setIsThinking] = useState(false);
    const [queryStartTime, setQueryStartTime] = useState(null); 

    // Combine token verification, login status handling.
    useEffect(() => {
        const handleAuthAndNotifications = () => {
            const token = localStorage.getItem('token');
            if (token) {
                verifyToken(token, navigate); // Run once on mount
            }
        };
        handleAuthAndNotifications();
    }, [navigate]); 
    
    useEffect(() => {
        if (loginStatus) {
            setToast({
                show: true,
                message: loginStatus,
                type: loginStatus.includes('Successfully') ? 'success' : 'error',
            });
            autoCloseToast();
            localStorage.removeItem('status');
        }
    }, [loginStatus]);

    // Automatically close the toast after a timeout
    const autoCloseToast = useCallback(() => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000);
    }, []);

    // Handle input changes
    const handleInputChange = (event) => setInputText(event.target.value);

    // Trigger file input click
    const handleFileClick = () => {
        fileInputRef.current.click();
    }
    const handleFileChange = async (event) => {
        const files = event.target.files;
        if (!files.length) return;
    
        const validExtensions = ['.pdf', '.xlsx', '.txt', '.pptx', '.docx', '.csv'];
        const maxFileSize = 100 * 1024 * 1024; 
        let totalSize = 0;
    
        const formData = new FormData();
        let fileList = [];
    
        // Validate and prepare files
        for (const file of files) {
            totalSize += file.size;
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (!validExtensions.includes(fileExtension)) {
                showToast(`Invalid file type: ${file.name}. Upload supported formats.`, 'error');
                return;
            }
            // Add each file to FormData
            formData.append("files", file);
            fileList.push({ filename: file.name, content_type: file.type});
        }
        if (totalSize > maxFileSize) {
            showToast(`Total file size exceeds 100MB. Select files within 100MB.`, 'error');
            return;
        }
    
        setIsLoading(true);
        const overallStartTime = Date.now();
        try {
            // Upload files
            const uploadResponse = await uploadFile(formData);
            console.log(uploadResponse);
            const overallUploadDuration = (Date.now() - overallStartTime) / 1000;

            const successfulFiles = uploadResponse[0].successful_files.files;
            const failedFiles = uploadResponse[1].failed_files.files;
            const filesAlreadyExist = uploadResponse[2].files_already_exist.files;
    
            const failedCount = uploadResponse[1].failed_files.total_count;
            const alreadyExistCount = uploadResponse[2].files_already_exist.total_count;
            const successCount = uploadResponse[0].successful_files.total_count;
    
            // Extract processing times from API response
            const failedTimeStr = uploadResponse[1].failed_files.total_processing_time;
            const alreadyExistTimeStr = uploadResponse[2].files_already_exist.total_processing_time;

            // Convert to numbers
            const failedTime = parseFloat(failedTimeStr.match(/[\d.]+/)[0]);
            const alreadyExistTime = parseFloat(alreadyExistTimeStr.match(/[\d.]+/)[0]);
            const adjustedTotalTime = overallUploadDuration - failedTime - alreadyExistTime;
    
            // Prepare the toast message
            let message = '';
            if (successCount > 0) {
                message += `<span style="color: green;">Success (${successCount}): ${successfulFiles.join(', ')}</span><br>`;
            }
            if (failedCount > 0) {
                message += `<span style="color: red;">Failed (${failedCount}): ${failedFiles.join(', ')}</span><br>`;
            }
            if (alreadyExistCount > 0) {
                message += `<span style="color: red;">Already Exist (${alreadyExistCount}): ${filesAlreadyExist.join(', ')}</span>`;
            }

            // Determine toast type
            let toastType = 'success'; 
            if (successCount === 0 && (failedCount > 0 || alreadyExistCount > 0)) {
                toastType = 'error';
            }
            // Send time details only for successfully uploaded files
            if (successCount > 0) {
                await sendFileUploadTotalTime({ 
                    files: successfulFiles, 
                    total_processing_time: adjustedTotalTime,
                    total_files_count:  successCount,
                });
            }
            showToast(message.trim(), toastType);
        } catch (error) {
            showToast(`Upload failed: ${error}`, 'error');
        }
        setIsLoading(false);
        event.target.value = null; 
    };

    // Show toast message with auto-close functionality
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        autoCloseToast();
    };

  
    const onSend = async (event) => {
        event.preventDefault();
        if (!inputText.trim()) {
            showToast('Please enter a prompt!', 'error');
            return;
        }
        
        const startTime = Date.now();
        setQueryStartTime(startTime);
        setMessages((prevMessages) => [...prevMessages, { user: 'user', response: inputText }]);
        setInputText('');
        setIsThinking(true); 
    
        // Close existing EventSource if open
        if (eventSource) {
            eventSource.close();
        }
    
        try {
            const getToken = () => localStorage.getItem('token');
            // Get Token
            const token = getToken(); 
            console.log(token);
            const newEventSource = new EventSource(
                `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/stream/?user_query=${inputText}`, {
                method: 'GET',
            }); 
            setMessages(prevMessages => [...prevMessages, { user: 'bot', response: '' }])
    
            newEventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data);
            
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
            
                    // Check if the last message is from the bot
                    if (lastMessage.user === 'bot') {
                        if (data.type === "token" && data.content) {
                            lastMessage.response += data.content;
                        }
                        if (data.type === "image" && data.content) {
                            lastMessage.image = data.content;
                        }
                        console.log(Array.isArray(data.content));
                        if (data.type === "filename" && Array.isArray(data.content)) {
                            lastMessage.details = data.content;
                        }
                    } else {
                        const newMessage = {
                            user: 'bot',
                            response: data.type === "token" ? data.content : '',
                            image: data.type === "image" ? data.content : '',
                            filenames: data.type === "filename" ? data.content : []
                        };
                        updatedMessages.push(newMessage);
                    }
            
                    return updatedMessages;
                });

                setIsThinking(false); 
                if (data.type === "done") {
                    newEventSource.close();
                    const endTime = Date.now();
                    const queryDuration = endTime - startTime;
                    const total_time = queryDuration / 1000;
                    const convertValue = Number(total_time.toFixed(2));
                    sendQueryTotalTime({ query: inputText, total_time: convertValue });
                }
            };
            
            newEventSource.onerror = (error) => {
                console.error("EventSource Error:", error);
                showToast(error, 'error');
                newEventSource.close();
                setIsThinking(false);
                
            };
    
            setEventSource(newEventSource);
            
    
        } catch (error) {
            showToast('Token expired, please login again.', 'error');
            navigate('/');
        }
    };
    

    // Get unique value from details
    const getUniqueDetails = (details) => {
        if (!Array.isArray(details)) return [];
        return [...new Set(details)];
    };
    // Scroll to bottom of chat container when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // Only trigger when messages change

    const ThinkingAnimation = () => {
        return (
            <div className="flex items-center justify-center space-x-2 text-black text-lg">
                <span className="animate-pulse">Thinking</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
            </div>
        );
    };
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center m-2">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
                </div>
             )}
            <div className="w-full h-[calc(89vh)] flex flex-col justify-between shadow-custom-bottom 
                rounded-lg bg-[rgb(249,243,241)] mb-10 relative">
                <div className="flex-1 h-full p-4 overflow-y-auto scrollbar scrollbar-track-[rgb(249,243,241)] 
                    scrollbar-thumb-[rgb(217,119,87)] hover:scrollbar-thumb-[rgb(217,119,87,1)]" ref={chatContainerRef} data-testid="chat-container">
                    <div className="flex flex-col space-y-3">
                        <Toast toast={toast} setToast={setToast} /> 
                        {messages.map((message, index) => (
                            <div key={index} className="flex flex-col space-x-2 items-start min-w-[30%]">
                                <div className="flex items-center space-x-2 mx-10 font-semibold min-w-[30%]">
                                    {message.user === 'user' ? (
                                        <FaUserCircle size={26} className="text-[rgb(217,119,87)] mr-8" />
                                    ) : (
                                        <FaRobot size={26} className="text-[rgb(217,119,87)] mr-8" />
                                    )}
                                    <div className="p-2 mb-2  shadow-custom-bottom bg-[rgb(247,246,245)]  rounded-tr-xl rounded-bl-xl rounded-br-xl 
                                        text-black  break-all w-fit min-w-[30%] ">  
                                        {message.image && (
                                            <div className="flex flex-wrap gap-4">
                                                <img src={`data:image/png;base64,${message.image}`}  alt={`Message related`} 
                                                    style={{ width: '200px', height: '200px' }} className="border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <span>{message.response}</span>
                                        {isThinking && index === messages.length - 1 && (
                                            <ThinkingAnimation />
                                        )}
                                        
                                        {message.details && (
                                            <div className="mt-2 flex justify-end">
                                                <Popover placement="right" 
                                                    content={
                                                        <div className="flex flex-col max-w-xs">
                                                            {getUniqueDetails(message.details).map((detail, detailIndex) => (
                                                                <p key={detailIndex} className='px-3 py-1 text-black break-words'>{detail}</p>
                                                            ))}
                                                        </div>
                                                    }
                                                >
                                                    <span className="text-black font-bold -ml-10 cursor-pointer text-xs">More details</span>
                                                </Popover>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-3">
                    <form onSubmit={onSend} className="flex items-center space-x-4">
                        <Textarea placeholder="Enter a prompt.."  value={inputText} onChange={handleInputChange}
                           onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onSend(e); 
                                }
                            }}
                            className="h-full bg-[rgb(205, 111, 71)] border-black text-black scrollbar-track-slate-700 scrollbar-thumb-slate-500" 
                        />
                        <Button type="submit" className="rounded-lg items-center text-sm m-2 bg-[rgb(217,119,87)]" >
                            <FaPaperPlane />
                        </Button>
                        <FaPaperclip size={22} className="text-[rgb(217,119,87)]  cursor-pointer " onClick={handleFileClick} />
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}
                            accept=".pdf,.xlsx,.txt,.pptx,.docx,.csv" multiple  data-testid="file-input"
                        />
                    </form>
                </div>
            </div>
        </div>
        
    );
};

export default DashboardComp;
