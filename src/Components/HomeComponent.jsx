
import React, { useEffect, useState, useRef } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import { BsEmojiSmile, BsFilter, BsMicFill, BsFillStopFill, BsThreeDotsVertical } from 'react-icons/bs'
import { TbCircleDashed } from 'react-icons/tb'
import ChatComponent from './ChatComponent/ChatComponent'
import MessageCard from './MessageCard/MessageCard'
import { ImAttachment } from 'react-icons/im'
import "./HomeComponent.css"
import { useNavigate } from 'react-router-dom'
import Profile from './Profile/Profile'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CreateGroup from './Group/CreateGroup'
import { useDispatch, useSelector } from 'react-redux'
import { currentUser, logout, searchUser } from '../Redux/AuthRedux/Action'
import { createChat, getUsersChat, deleteChat } from '../Redux/Chat/Action'
import { createMessage, getAllMessages } from '../Redux/Message/Action'
import SockJs from "sockjs-client/dist/sockjs";
import { over } from 'stompjs'
import EmojiPicker from 'emoji-picker-react';
import VoiceToChat from './VoiceToChat/VoiceToChat'

const HomeComponent = () => {
    const { auth, chat, message } = useSelector(state => state);
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [queries, setQueries] = useState(null)
    const [currentChat, setCurrentChat] = useState(null)
    const token = localStorage.getItem("token");
    const [isProfile, setIsProfile] = useState(false);
    const navigate = useNavigate();
    const [anchorElMain, setAnchorElMain] = useState(null);
    const [anchorElChat, setAnchorElChat] = useState(null);
    const openMain = Boolean(anchorElMain);
    const openChat = Boolean(anchorElChat);
    const [isGroup, setIsGroup] = useState(false);
    const [isChat, setIsChat] = useState(false);
    const dispatch = useDispatch();
    const messageContainerRef = useRef(null);
    const [lastMessages, setLastMessages] = useState({});

    const categoryConfig = [
        {
            category: 'suggested',
            name: 'Часто використані'
        },
        {
            category: 'smileys_people',
            name: 'Смайли та люди'
        },
        {
            category: 'animals_nature',
            name: 'Тварини та природа'
        },
        {
            category: 'food_drink',
            name: 'Їжа та напої'
        },
        {
            category: 'travel_places',
            name: 'Подорожі та місця'
        },
        {
            category: 'activities',
            name: 'Активності'
        },
        {
            category: 'objects',
            name: 'Об’єкти'
        },
        {
            category: 'symbols',
            name: 'Символи'
        },
        {
            category: 'flags',
            name: 'Прапори'
        }
    ];

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const connect = () => {
        const sock = new SockJs("http://localhost:8080/ws");
        const stomp = over(sock);
        setStompClient(stomp);

        const headers = {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        };

        stomp.connect(headers, onConnect, onError);
    };

    function getCookie(name) {
        const val = `; ${document.cookie}`;
        const cookieParts = val.split(`; ${name}=`);
        if (cookieParts.length === 2) {
            return cookieParts.pop().split(";").shift();
        }
    }

    const onError = (error) => {
        console.log("On Error ", error);
    };

    const onConnect = () => {
        setIsConnected(true);

        if (stompClient && currentChat) {
            if (!currentChat.isGroupChat) {
                stompClient
                    .subscribe(`/user/${currentChat?.id}`, onMessageReceive);
            } else {
                stompClient
                    .subscribe(`/group/${currentChat?.id}`, onMessageReceive);
            }
        }
    };

    const onMessageReceive = (payload) => {
        const mess = JSON.parse(payload.body);
        setMessages((prevMessages) => [...prevMessages, mess]);
    };

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {
        if (isConnected && stompClient && currentChat?.id) {
            const subscr = currentChat.isGroupChat
                ? stompClient.subscribe(`/group/${currentChat.id}`, onMessageReceive)
                : stompClient.subscribe(`/user/${currentChat.id}`, onMessageReceive);

            return () => {
                subscr.unsubscribe();
            };
        }
    }, [isConnected, stompClient, currentChat]);

    useEffect(() => {
        if (stompClient && message.newMessage && isConnected) {
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

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleClickOnChatCard = (userId) => {
        dispatch(createChat({ token, data: userId }));
        setQueries(null);
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

    const handleClickMain = (event) => {
        setAnchorElMain(event.target);
    };

    const handleCloseMain = () => {
        setAnchorElMain(null);
    };

    const handleClickChat = (event) => {
        setAnchorElChat(event.target);
    };

    const handleCloseChat = () => {
        setAnchorElChat(null);
    };

    const handleNavigate = () => {
        handleCloseMain();
        setCurrentChat(null);
        setIsProfile(true);
    }
    const handleCloseOpenProfile = () => {
        setIsProfile(false);
        handleCloseMain();
    }

    const handleCreateGroup = () => {
        setIsGroup(true);
        setCurrentChat(null);
        handleCloseMain();
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
        setCurrentChat(null);
    }

    const handleDeleteChat = (chatId) => {
        dispatch(deleteChat({ token, chatId: chatId }));
        setCurrentChat(null);
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
            hour12: false,
            timeZone: "Europe/Kiev"
        };
        return new Date(timestamp).toLocaleDateString(undefined, options);
    };

    const handleEmojiClick = (emojiObject) => {
        setContent(content + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const { isListening, transcript, startListening, stopListening } = VoiceToChat({ continuous: false });

    const startStopListening = () => {
        isListening ? stopVoiceInput() : startListening();
    }

    const stopVoiceInput = () => {
        console.log(transcript)
        if (content === "") {
            setContent(transcript);
        }
        else {
            setContent(content + " " + transcript);
        }
        console.log("content: ", content);
        stopListening();
    }

    return (
        <div className='relative'>
            <div className='w-full py-14 bg-[#724bb9]'></div>
            <div className='flex bg-[#282828] h-[90vh] absolute top-[5vh] left-[2vw] w-[96vw]'>
                <div className='left w-[30%] bg-[#717171] h-full'>
                    {/* -profile- */}

                    {isGroup && <CreateGroup setIsGroup={setIsGroup} />}
                    {isProfile && <div className='w-full h-full'><Profile handleCloseOpenProfile={handleCloseOpenProfile} /></div>}

                    {!isProfile && !isGroup
                        && <div className='w-full'>


                            {/* -home- */}

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
                                            aria-controls={openMain ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={openMain ? 'true' : undefined}
                                            onClick={handleClickMain}
                                            className='fill-[#312d36]' />
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorElMain}
                                            open={openMain}
                                            onClose={handleCloseMain}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                            sx={{
                                                '& .MuiPaper-root': {
                                                    backgroundColor: '#724bb9',
                                                }
                                            }}
                                        >
                                            <MenuItem sx={{ backgroundColor: '#724bb9', color: '#121212' }} onClick={handleNavigate}>Профіль</MenuItem>
                                            <MenuItem sx={{ backgroundColor: '#724bb9', color: '#121212' }} onClick={handleCreateGroup}>Створити групу</MenuItem>
                                            <MenuItem sx={{ backgroundColor: '#724bb9', color: '#121212' }} onClick={handleLogout}>Вийти</MenuItem>
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
                                        setQueries(e.target.value)
                                        handleSearch(e.target.value)

                                    }}
                                    value={queries}
                                />
                                <AiOutlineSearch className='left-5 top-7 absolute fill-[#312d36]' />
                                <div>
                                    <BsFilter className='ml-4 text-3xl' />
                                </div>
                            </div>

                            {/*-all user- */}
                            <div className='bg-[#1c1821] overflow-y-scroll h-[72vh] px-3'>
                                {queries &&
                                    Array.from(auth.searchUser)?.map((item) => (
                                        <div onClick={() => handleClickOnChatCard(item.id)}>
                                            <hr />
                                            <ChatComponent
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
                                {chat.chats?.length > 0 && !queries &&
                                    chat.chats?.map((item) => {
                                        console.log("CHATS: ", chat.chats);
                                        console.log("Is group ", item.group);
                                        console.log("USERS ", item.users);
                                        return (
                                            <div onClick={() => handleCurrentChat(item)}>
                                                <hr />
                                                {item.group ? (
                                                    <ChatComponent
                                                        name={item.chatName}
                                                        userImg={item.chatImage || "/images/userIcon.png"}
                                                        lastMessage={{
                                                            content:
                                                                lastMessages[item.id]?.content || "Починайте розмову",
                                                            timestamp: formatTimestamp(lastMessages[item.id]?.timestamp) || "",
                                                        }}
                                                    />)
                                                    : (
                                                        <ChatComponent
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


                {/*-default chatapp page-*/}
                {!currentChat && <div className='w-[70%] flex flex-col items-center justify-center h-full'>
                    <div className='max-w-[70%] text-center'>
                        <img src="/images/ChatifyLogo.png" alt="" />
                        <h1 className='text-4xl text-[#835ec1]'>Чат застосунок</h1>
                        <p className='my-9 text-[#724bb9]'>Надсилай і отримуй повідомлення. Створюй групи.
                            <br />Використовуй перетворення голосу в текст.
                        </p>
                    </div>
                </div>
                }

                {/*-message part-*/}

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
                                    {/* <AiOutlineSearch /> */}
                                    {currentChat.createdBy?.id === auth.reqUser?.id &&
                                        <div>
                                            <BsThreeDotsVertical
                                                id="chat-button"
                                                aria-controls={openChat ? 'chat-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={openChat ? 'true' : undefined}
                                                onClick={handleClickChat} />
                                            <Menu
                                                id="chat-menu"
                                                anchorEl={anchorElChat}
                                                open={openChat}
                                                onClose={handleCloseChat}
                                                MenuListProps={{
                                                    'aria-labelledby': 'chat-button',
                                                }}
                                                sx={{
                                                    '& .MuiPaper-root': {
                                                        backgroundColor: '#a384d1',
                                                    }
                                                }}
                                            >
                                                <MenuItem sx={{ backgroundColor: '#a384d1', color: '#121212' }} onClick={() => handleDeleteChat(currentChat.id)}>Видалити чат</MenuItem>
                                            </Menu>
                                        </div>}
                                </div>
                            </div>
                        </div>
                        {/*-message section-*/}
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
                                {
                                    showEmojiPicker && (
                                        <div ref={messageContainerRef}>
                                            <EmojiPicker onEmojiClick={e => handleEmojiClick(e)}
                                                pickerStyle={{ position: 'absolute', bottom: '50px', right: '0px' }}
                                                theme="dark"
                                                categories={categoryConfig}
                                                previewConfig={{
                                                    defaultEmoji: "1f601",
                                                    defaultCaption: "Який у вас настрій?",
                                                    showPreview: true
                                                }}
                                                searchPlaceholder="Шукати" />
                                        </div>
                                    )}
                            </div>
                        </div>
                        {/*-footer part-*/}
                        <div className='footer bg-[#47444c] absolute bottom-0 w-full py-3 text-2xl'>
                            <div className='flex justify-between items-center px-5 relative'>
                                <BsEmojiSmile className='cursor-pointer' onClick={toggleEmojiPicker} />
                                <ImAttachment />
                                <textarea
                                    rows='1'
                                    className='py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]'
                                    type='text'
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder='Введіть повідомлення'
                                    disabled={isListening}
                                    value={isListening ?
                                        content + (transcript.length ? (content.length ? ' ' : '') + transcript : '') : content}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateNewMessage();
                                            setContent("");
                                        }
                                    }}
                                />
                                {!isListening && <BsMicFill onClick={startStopListening} />
                                }
                                {isListening && <BsFillStopFill onClick={startStopListening} />
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );

};

export default HomeComponent