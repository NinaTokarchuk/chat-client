import React from "react";
import { useNavigate } from "react-router-dom";

const StatusUserCard = () => {

    const navigate=useNavigate();
    const handleNavigate = () => {
        navigate(`/status/{userId}`)
    }
    return (
        <div onClick={handleNavigate} className="cursor-pointer flex items-center p-3">
            <div>
                <img className="h-7 w-7 lg:w-10 lg:h-10 rounded-full" src="/images/userIcon.png" alt="" />
            </div>
            <div>
                <p className="ml-2 text-black">
                    Ім'я користувача
                </p>
            </div>
        </div>
    )
}

export default StatusUserCard;