import { Avatar, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { BsArrowLeft, BsCheck2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../Redux/Chat/Action";

const NewGroup = ({ groupMember, setIsGroup }) => {
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const uploadToCloudnary = (pics) => {
        setIsImageUploading(true);
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "ml_default");
        data.append("cloud_name", "dptvtq1ua");
        fetch("https://api.cloudinary.com/v1_1/dptvtq1ua/image/upload", {
            method: "post",
            body: data
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("imgurl", data);
                setGroupImage(data.url.toString());
                setIsImageUploading(false);
            })
    }

    const handleCreateGroup = () => {
        let userIds = [];

        for (let user of groupMember) {
            userIds.push(user.id);
        }
        const group = {
            userIds,
            chatName: groupName,
            chatImage: groupImage
        };
        const data = {
            group,
            token
        };

        dispatch(createGroupChat(data));
        setIsGroup(false);
    }

    const handleClick = () => {
        setIsGroup(false);
    }

    return (
        <div className="w-full h-full">
            <div className="flex items-center space-x-10 bg-[#724bb9] text-white pt-16 px-10 pb-5">
                <BsArrowLeft onClick={handleClick} className="cursor-pointer text-2xl font-bold" />
                <p className="text-xl font-semibold">Нова група</p>
            </div>
            <div className="flex flex-col justify-center items-center my-12">
                <label htmlFor="imgInput" className="relative">
                    {/* <img
                        className="h-33 w-33 rounded-full"
                        src={groupImage || "/images/userIcon.png"}
                        alt="" /> */}
                    <Avatar sx={{ width: "15rem", height: "15rem" }} alt="group icon" src={groupImage || "/images/userIcon.png"} />
                    {isImageUploading && <CircularProgress className="absolute top-[5rem] left-[6rem]" />}
                </label>
                <input
                    type="file"
                    id="imgInput"
                    className="hidden"
                    onChange={(e) => uploadToCloudnary(e.target.files[0])}
                />
            </div>
            <div className="w-full flex justify-between items-center py-2 px-5">
                <input type="text"
                    className="w-full outline-none border-b-2 border-[#724bb9] px-2 bg-transparent text-black"
                    placeholder="Тема групи"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)} />
            </div>
            {groupName && <div className="py-10 bg-[#717171] flex items-center justify-center">
                <Button onClick={handleCreateGroup}>

                    <div className="bg-[#724bb9] rounded-full p-4">
                        <BsCheck2 className="text-white font-bold text-3xl" />
                    </div>
                </Button>
            </div>
            }
        </div>
    )
}

export default NewGroup