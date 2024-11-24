import React from "react";
import { useEffect } from "react";

const MessageCard = ({ isReqUserMessage, content, timestamp, username, isGroupMessage }) => {
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
        <div className={`text-[#121212] py-2 px-2 rounded-md max-w-[50%] ${isReqUserMessage ? "self-start bg-[#8b8b8b]" : "self-end bg-[#c2ace1]"}`}>
            <p className="text-xs text-gray-600 mt-1">{
                isGroupMessage ?
                    username : ""
            }
            </p>
            <div className="flex">
                <p className="text-[#121212]">{content}</p>
                {timestamp && (
                    <span className="text-xs
                     text-gray-600 mt-1 ml-1">
                        {formatTimestamp(timestamp)}
                    </span>
                )}
            </div>
        </div>
    )
}

export default MessageCard