import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import SelectedMember from "./SelectedMember";
import ChatCard from "../ChatCard/ChatCard";
import NewGroup from "./NewGroup";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Auth/Action";

const CreateGroup = ({ setIsGroup }) => {
    const [newGroup, setNewGroup] = useState(false);
    const [groupMember, setGroupMember] = useState(new Set());
    const handleRemoveMember = (item) => {
        groupMember.delete(item);
        setGroupMember(groupMember);
    }
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const { auth } = useSelector(store => store);
    const [query, setQuery] = useState(null);
    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword }, token));
    }
    return (
        <div className="w-full h-full">
            {
                !newGroup && (
                    <div>
                        <div className="flex items-center space-x-10 bg-[#724bb9] pt-16 px-10 pb-5">
                            <BsArrowLeft t
                                className="cursor-pointer text-2xl font-bold"
                            />
                            <p className="text-xl font-semibold">Додати учасника групи</p>
                        </div>
                        <div className="relative bg-white py-4 px-3">
                            <div className="flex space-x-2 flex-wrap space-y-1">
                                {
                                    groupMember.size > 0 && Array.from(groupMember).map((item) => <SelectedMember handleRemoveMember={
                                        () => handleRemoveMember(item)
                                    } member={item} />)
                                }
                            </div>
                            <input type="text" onChange={(e) => {
                                setQuery(e.target.value);
                                handleSearch(e.target.value);
                            }}
                                className="outline-none border-b border-[#8888] p-2 w-[93%]"
                                placeholder="Шукайте користувача"
                                value={query}
                            />
                        </div>

                        <div className="bg-white overflow-y-scroll h-[50.2vh]">
                            {query &&
                                Array.from(auth.searchUser)?.map((item) =>
                                (<div onClick={() => {
                                    groupMember.add(item);
                                    setGroupMember(groupMember);
                                    setQuery("");
                                }}
                                    key={item?.id}
                                >
                                    <hr />
                                    <ChatCard userImg={item.profilePicture} name={item.fullName} />
                                </div>)
                                )}

                        </div>

                        <div className="bottom-10 py-10 bg-slate-200 flex items-center justify-center">
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