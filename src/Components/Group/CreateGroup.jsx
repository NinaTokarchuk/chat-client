import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import NewGroup from "./NewGroup";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Auth/Action";
import { useNavigate } from "react-router-dom";

const CreateGroup = ({ setIsGroup }) => {
    const navigate = useNavigate();
    const [newGroup, setNewGroup] = useState(false);
    const [groupMember, setGroupMember] = useState(new Set());
    const handleRemoveMember = (item) => {
        const newGroupMember = new Set(groupMember);
        newGroupMember.delete(item);
        setGroupMember(newGroupMember);
    }
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const { auth } = useSelector(store => store);
    const [query, setQuery] = useState(null);
    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword }, token));
    }
    const handleClick = () => {
        setIsGroup(false);
        navigate("/")
    }
    return (
        <div className="w-full h-full bg-[#1c1821]">
            {
                !newGroup && (
                    <div>
                        <div className="flex items-center space-x-10 bg-[#724bb9] pt-16 px-10 pb-5">
                            <BsArrowLeft onClick={handleClick}
                                className="cursor-pointer text-2xl font-bold"
                            />
                            <p className="text-xl font-semibold">Додати учасника групи</p>
                        </div>
                        <div className="relative bg-[#1c1821] py-4 px-3">
                            <div className="flex space-x-2 flex-wrap">
                                {
                                    groupMember.size > 0 && Array.from(groupMember)
                                        .map((item) => <SelectedMember handleRemoveMember={
                                            () => handleRemoveMember(item)
                                        } member={item} />)
                                }
                            </div>
                            <input type="text" onChange={(e) => {
                                setQuery(e.target.value);
                                handleSearch(e.target.value);
                            }}
                                className="bg-[#312d36] outline-none border-b border-[#312d36] p-2 w-[93%]"
                                placeholder="Шукайте користувача"
                                value={query}
                            />
                        </div>

                        <div className="bg-[#1c1821] overflow-y-scroll h-[50.2vh]">
                            {query &&
                                Array.from(auth.searchUser)?.map((item) =>
                                (
                                    <div onClick={() => {
                                        const newSet = new Set(groupMember);
                                        newSet.add(item);
                                        setGroupMember(newSet);
                                        setQuery("");
                                    }}
                                        key={item?.id}
                                    >
                                        <hr />
                                        <ChatCard userImg={item.profilePicture} name={item.fullName} />
                                    </div>
                                )
                                )}

                        </div>

                        <div className="bottom-10 py-10 bg-[#1c1821] flex items-center justify-center">
                            <div
                                className="bg-[#724bb9] rounded-full p-4 cursor-pointer"
                                onClick={() => {
                                    setNewGroup(true);
                                }}>
                                <BsArrowRight className="text-white font-bold text-3xl" />
                            </div>
                        </div>

                    </div>
                )
            }
            {newGroup && <NewGroup setIsGroup={setIsGroup} groupMember={groupMember} />}
        </div>
    )
}

export default CreateGroup