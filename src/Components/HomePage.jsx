
import React, { useEffect, useState, useRef } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from 'react-icons/bs'
import { TbCircleDashed } from 'react-icons/tb'
import ChatCard from './ChatCard/ChatCard'
import MessageCard from './MessageCard/MessageCard'
import { ImAttachment } from 'react-icons/im'
import "./HomePage.css"
import { useNavigate } from 'react-router-dom'
import Profile from './Profile/Profile'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CreateGroup from './Group/CreateGroup'
import { useDispatch, useSelector } from 'react-redux'
import { currentUser, logout, searchUser } from '../Redux/Auth/Action'
import { createChat, getUsersChat } from '../Redux/Chat/Action'
import { createMessage, getAllMessages } from '../Redux/Message/Action'
import SockJs from "sockjs-client/dist/sockjs";
// import * as Stomp from 'stompjs';
import { over } from 'stompjs'
var global = window;
const HomePage = () => {
    const { auth, chat, message } = useSelector(store => store);
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [querys, setQuerys] = useState(null)
    const [currentChat, setCurrentChat] = useState(null)
    const token = localStorage.getItem("token");
    const [isProfile, setIsProfile] = useState(false);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [isGroup, setIsGroup] = useState(false);
    const [isChat, setIsChat] = useState(false);
    const dispatch = useDispatch();
    const messageContainerRef = useRef(null);
    const [lastMessages, setLastMessages] = useState({});

    useEffect(() => {
        // Scroll to bottom whenever messages change
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // const onError = (error) => {
    //     console.error("Connection error:", error);
    // }
    // const onConnect = () => {
    //     setIsConnect(true);
    // }

    // const connect = () => {
    //     const sock = new SockJS("http://localhost:8080/ws");
    //     const temp = over(sock);
    //     setStompClient(temp);
    //     console.log("set Stomp Client to = ", stompClient);
    //     const headers = {
    //         Authorization: `Bearer ${token}`
    //     }
    //     temp.connect(headers, onConnect, onError);
    // }

    // function getCookie(name) {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) {
    //         return parts.pop().split(";").shift();
    //     }
    // }

    // useEffect(() => {
    //     connect();
    // })
    // useEffect(() => {
    //     if (message.newMessage && stompClient) {
    //         setMessages([...messages, message.newMessage]);
    //         stompClient?.send("/app/message", {}, JSON.stringify(message.newMessage));
    //     }
    // }, [message.newMessage, messages, stompClient])

    // const onMessageReceive = (payload) => {
    //     console.log("receive message ", JSON.parse(payload.body));
    //     const receivedMessage = JSON.parse(payload.body);
    //     setMessages([...messages, receivedMessage]);
    // }

    // useEffect(() => {
    //     if (isConnect && stompClient && auth.reqUser && currentChat) {
    //         console.log("IS CONNECT ", isConnect);
    //         //"/group/"+ currentChat.id.toString()
    //         const subscription = stompClient.subscribe("/group/public", onMessageReceive);
    //         return () => {
    //             subscription.unsubscribe();
    //         }
    //     }
    // }, [isConnect, stompClient, auth.reqUser, currentChat, onMessageReceive]);

    // Function to establish a WebSocket connection
    const connect = () => {
        const sock = new SockJs("http://localhost:8080/ws");
        const temp = over(sock);
        setStompClient(temp);

        const headers = {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        };

        // Connect to WebSocket server
        temp.connect(headers, onConnect, onError);
    };

    // Function to get a specific cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }

    // Callback for WebSocket connection error
    const onError = (error) => {
        console.log("on error ", error);
    };

    // Callback for successful WebSocket connection
    const onConnect = () => {
        setIsConnected(true);

        // Subscribe to the current chat messages based on the chat type
        if (stompClient && currentChat) {
            if (currentChat.isGroupChat) {
                // Subscribe to group chat messages
                stompClient.subscribe(`/group/${currentChat?.id}`, onMessageReceive);
            } else {
                // Subscribe to direct user messages
                stompClient.subscribe(`/user/${currentChat?.id}`, onMessageReceive);
            }
        }
    };

    // Callback to handle received messages from WebSocket
    const onMessageReceive = (payload) => {
        const receivedMessage = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    // Effect to establish a WebSocket connection
    useEffect(() => {
        connect();
    }, []);

    // Effect to subscribe to a chat when connected
    useEffect(() => {
        if (isConnected && stompClient && currentChat?.id) {
            const subscription = currentChat.isGroupChat
                ? stompClient.subscribe(`/group/${currentChat.id}`, onMessageReceive)
                : stompClient.subscribe(`/user/${currentChat.id}`, onMessageReceive);

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [isConnected, stompClient, currentChat]);

    // Effect to handle sending a new message via WebSocket
    useEffect(() => {
        if (message.newMessage && stompClient) {
            stompClient.send("/app/message", {}, JSON.stringify(message.newMessage));
            setMessages((prevMessages) => [...prevMessages, message.newMessage]);
        }
    }, [message.newMessage, stompClient]);



    useEffect(() => {
        setMessages(message.messages);
    }, [message.messages])
    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword }, token));
    }
    const [content, setContent] = useState("")
    const handleCreateNewMessage = () => {
        console.log("createNEW MESSAGE: ", content)
        dispatch(createMessage({ token, data: { chatId: currentChat.id, content: content } }))
    };

    const handleClickOnChatCard = (userId) => {
        dispatch(createChat({ token, data: userId }));
        setQuerys(null);
    }

    useEffect(() => {
        dispatch(getUsersChat({ token }))
    }, [chat.createdChat, chat.createdGroup])

    useEffect(() => {
        if (currentChat?.id) {
            console.log("!!!!!!!!!CURRENT CHAT ID = ", currentChat.id)
            dispatch(getAllMessages(currentChat.id, token));
        }
    }, [currentChat, message.newMessage])

    const handleNavigate = () => {
        // navigate (/profile)
        setIsProfile(true);
    }
    const handleCloseOpenProfile = () => {
        setIsProfile(false);
    }
    const handleClick = (e) => {
        setAnchorEl(e.target);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCreateGroup = () => {
        setIsGroup(true);
    }

    const disconnect = () => {
        if (stompClient) {
            stompClient.disconnect(() => {
                console.log("Disconnected");
            }, {});
            setIsConnected(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        disconnect();
        navigate("/signup");
    }

    useEffect(() => {
        if (!auth.reqUser) {
            navigate("/signup")
        }
    }, [auth.reqUser]);
    useEffect(() => {

        if (token) {
            connect();
            dispatch(currentUser(token));
        }
        else {
            disconnect();
        }
    }, [token])

    // Effect to update lastMessages when messages change
    useEffect(() => {
        const prevLastMessages = { ...lastMessages };
        if (message.messages && message.messages.length > 0) {
            message.messages.forEach((msg) => {
                prevLastMessages[msg.chatId] = msg;
            });

            setLastMessages(prevLastMessages);
        }
    }, [message.messages]);

    const handleCurrentChat = (item) => {
        setCurrentChat(item);
    }
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "";

        const options = {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            // second: "2-digit",
            hour12: false, // Use 24-hour format
            timeZone: "Europe/Kiev" // Set the timezone to Kyiv (Kiev)
        };
        return new Date(timestamp).toLocaleDateString(undefined, options);
    };
    console.log("current chat ", currentChat);
    return (
        <div className='relative'>
            <div className='w-full py-14 bg-[#724bb9]'></div>
            <div className='flex bg-[#282828] h-[90vh] absolute top-[5vh] left-[2vw] w-[96vw]'>
                <div className='left w-[30%] bg-[#717171] h-full'>
                    {/* profile */}

                    {isGroup && <CreateGroup setIsGroup={setIsGroup} />}
                    {isProfile && <div className='w-full h-full'><Profile handleCloseOpenProfile={handleCloseOpenProfile} /></div>}

                    {!isProfile && !isGroup
                        && <div className='w-full'>


                            {/* home */}

                            <div className='flex justify-between items-center p-3'>
                                <div onClick={handleNavigate} className='flex items-center space-x-3'>
                                    <img
                                        className='rounded-full w-10 h-10 cursor-pointer'
                                        src={auth.reqUser?.profilePicture || "/images/userIcon.png"}
                                        alt=""
                                    />
                                    <p className='text-[#312d36]'>{auth.reqUser?.fullName}</p>
                                </div>
                                <div className='space-x-3 text-2xl flex'>
                                    <TbCircleDashed onClick={() => navigate("/status")} className='stroke-[#312d36] cursor-pointer' />
                                    <BiCommentDetail className='fill-[#312d36]' />
                                    <div>
                                        <BsThreeDotsVertical
                                            id="basic-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick}
                                            className='fill-[#312d36]' />
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                                            <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
                                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                        </Menu>
                                    </div>

                                </div>
                            </div>


                            <div className='relative flex justify-center items-center text-[#8b8b8b] bg-[#1c1821] py-4 px-3'>
                                <input
                                    className='border-none outline-none bg-[#717171] placeholder:text-[#312d36] rounded-md w-[93%] pl-9 py-2'
                                    type="text"
                                    placeholder='Шукати або почати новий чат'
                                    onChange={(e) => {
                                        setQuerys(e.target.value)
                                        handleSearch(e.target.value)

                                    }}
                                    value={querys}
                                />
                                <AiOutlineSearch className='left-5 top-7 absolute fill-[#312d36]' />
                                <div>
                                    <BsFilter className='ml-4 text-3xl' />
                                </div>
                            </div>

                            {/*all user */}
                            <div className='bg-[#1c1821] overflow-y-scroll h-[72vh] px-3'>
                                {querys &&
                                    Array.from(auth.searchUser)?.map((item) => (
                                        <div onClick={() => handleClickOnChatCard(item.id)}>
                                            <hr />
                                            <ChatCard
                                                name={item.fullName}
                                                userImg={
                                                    item.profilePicture || "/images/userIcon.png"
                                                }
                                                lastMessage={{
                                                    content:
                                                        lastMessages[item.id]?.content || "Починайте розмову",
                                                    timestamp: formatTimestamp(lastMessages[item.id]?.timestamp) || "",
                                                }}
                                            />
                                        </div>
                                    ))
                                }
                                {chat.chats?.length > 0 && !querys &&
                                    chat.chats?.map((item) => {
                                        console.log("CHATS: ", chat.chats);
                                        console.log("Is group ", item.group);
                                        console.log("USERS ", item.users);
                                        return (
                                            <div onClick={() => handleCurrentChat(item)}>
                                                <hr />
                                                {item.group ? (
                                                    <ChatCard
                                                        name={item.chatName}
                                                        userImg={item.chatImage || "/images/userIcon.png"}
                                                        lastMessage={{
                                                            content:
                                                                lastMessages[item.id]?.content || "Починайте розмову",
                                                            timestamp: formatTimestamp(lastMessages[item.id]?.timestamp) || "",
                                                        }}
                                                    />)
                                                    : (
                                                        <ChatCard
                                                            isChat={true}
                                                            name={
                                                                auth.reqUser.id !== item.users[0]?.id
                                                                    ? item.users[0]?.fullName
                                                                    : item.users[1]?.fullName
                                                            }
                                                            userImg={
                                                                auth.reqUser.id !== item.users[0].id
                                                                    ? item?.users[0]?.profilePicture || "/images/userIcon.png"
                                                                    : item?.users[1]?.profilePicture || "/images/userIcon.png"
                                                            }
                                                            lastMessage={{
                                                                content:
                                                                    lastMessages[item.id]?.content || "Починайте розмову",
                                                                timestamp: formatTimestamp(lastMessages[item.id]?.timestamp) || "",
                                                            }}
                                                        />)
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>

                        </div>
                    }
                </div>


                {/*default chatapp page */}
                {!currentChat && <div className='w-[70%] flex flex-col items-center justify-center h-full'>
                    <div className='max-w-[70%] text-center'>
                        <img src="/images/By Nina Babii (1).png" alt="" />
                        <h1 className='text-4xl text-[#835ec1]'>Чат застосунок</h1>
                        <p className='my-9 text-[#724bb9]'>Надсилай і отримуй повідомлення без мережі.
                            <br />Використовуй на 4 різних девайсах і одному телефоні одночасно
                        </p>
                    </div>
                </div>
                }

                {/*message part */}

                {currentChat &&
                    <div className='w-[70%] relative bg-[#1c1821]'>
                        <div className='header absolute top-0 w-full bg-[#282828]'>
                            <div className='flex justify-between'>
                                <div className='py-3 space-x-4 flex items-center px-3'>
                                    <img className='w-10 h-10 rounded-full'
                                        src={currentChat.group ? currentChat?.chatImage || "/images/userIcon.png"
                                            : (auth.reqUser?.id !== currentChat?.users[0]?.id
                                                ? currentChat?.users[0]?.profilePicture || "/images/userIcon.png"
                                                : currentChat?.users[1]?.profilePicture || "/images/userIcon.png")}
                                        alt="" />
                                    <p>
                                        {currentChat.group ? currentChat?.chatName : (auth.reqUser?.id === currentChat?.users[0]?.id
                                            ? currentChat?.users[1]?.fullName
                                            : currentChat?.users[0]?.fullName)}
                                    </p>
                                </div>
                                <div className='py-3 flex space-x4 items-center px-3'>
                                    <AiOutlineSearch />
                                    <BsThreeDotsVertical />
                                </div>
                            </div>
                        </div>
                        {/* message section */}
                        <div className='px-10 h-[85vh] overflow-y-scroll pb-10' ref={messageContainerRef}>
                            <div className='space-y-1 flex flex-col justify-center mt-20 py-2'>
                                {message.messages.length > 0 &&
                                    message.messages?.map((item, i) =>
                                        <MessageCard
                                            isReqUserMessage={item.user.id !== auth.reqUser.id}
                                            content={item.content}
                                            timestamp={formatTimestamp(item.timestamp)}
                                            username={item.user.fullName}
                                            isGroupMessage={currentChat.group}
                                        />
                                    )
                                }
                            </div>
                        </div>
                        {/*  footer part*/}
                        <div className='footer bg-[#47444c] absolute bottom-0 w-full py-3 text-2xl'>
                            <div className='flex justify-between items-center px-5 relative'>

                                <BsEmojiSmile className='cursor-pointer' />
                                <ImAttachment />

                                <input
                                    className='py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]'
                                    type='text'
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder='Введіть повідомлення'
                                    value={content}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateNewMessage();
                                            setContent("");
                                        }
                                    }}
                                />
                                <BsMicFill />
                            </div>

                        </div>
                    </div>
                }
            </div>
        </div>
    );

};

export default HomePage