import React from "react";
import StatusUserCard from "./StatusUserCard";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Status = () => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(-1);
    }
    return (
        <div>
            <div className="flex items-center px-[14vw] py-[7vh]">
                {/* left side part */}
                <div className="left h-[85vh] bg-[#c2ace1] lg:w-[30%] w-[50%] px-5">
                    <div className="pt-5 h-[13%]">
                        <StatusUserCard></StatusUserCard>
                    </div>
                    <hr />
                    <div className="overflow-y-scroll h-[86%] pt-2">
                        {[1, 1, 1, 1, 1, 1, , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11].map((item) => <StatusUserCard />)}
                    </div>
                </div>
                {/* right side part */}
                <div className="relative h-[85vh] lg:w-[70%] w-[50%] bg-[#835ec1]">
                    <AiOutlineClose onClick={handleNavigate} className="text-black cursor-pointer absolute top-5 right-10 text-xl" />
                </div>
            </div>
        </div>
    )
}

export default Status;