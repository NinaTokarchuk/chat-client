import React from "react"

const ChatCard = ({ userImg, name, lastMessage }) => {
    // Function to format a timestamp to a readable date
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
                    {/* <div className="flex space-x-2 items-center">
                        <p className="text-xs py-1 px-2 text-[#47444c] bg-[#9371c9] rounded-full">5</p>
                    </div> */}
                </div>

            </div>

        </div>
    )
}

export default ChatCard