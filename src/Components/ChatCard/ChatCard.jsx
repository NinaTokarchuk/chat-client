import React from "react"

const ChatCard = ({ userImg, name, lastMessage }) => {

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
    return (
        <div className="flex items-center justify-center py-2 group cursor-pointer">
            <div className="w-[20%]">
                <img className='h-14 w-14 rounded-full' src={userImg || "/images/userIcon.png"} alt="" />
            </div>
            <div className="pl-5 w-[80%]">
                <div className="flex justify-between items-center">
                    <p className="text-lg text-[#ffffff]">{name}</p>
                    <p className="text-sm">{lastMessage ? formatTimestamp(lastMessage.timestamp) : ""}</p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-[#8b8b8b]">{lastMessage ? lastMessage.content : ""}</p>
                </div>

            </div>

        </div>
    )
}

export default ChatCard