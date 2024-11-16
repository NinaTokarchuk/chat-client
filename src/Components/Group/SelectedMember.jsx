import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const SelectedMember = ({handleRemoveMember, member}) => {
    return (
        <div className="flex items-center bg-[#312d36] rounded-full mb-2">
            <img className="w-7 h-7 rounded-full" src={member.profilePicture || "/images/userIcon.png"} alt="" />
            <p className="px-2">{member.fullName}</p>
            <AiOutlineClose onClick={ e => handleRemoveMember(e)} className="pr-1 cursor-pointer"/>
        </div>
    )
}

export default SelectedMember