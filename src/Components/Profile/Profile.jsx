import React, { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Redux/AuthRedux/Action";

const Profile = ({ handleCloseOpenProfile }) => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [flag, setFlag] = useState(false);
  const [userName, setUserName] = useState(auth.reqUser?.fullName || "Ім'я користувача");
  const [tempPicture, setTempPicture] = useState(null);
  const [error, setError] = useState("");

  const validateUserName = (name) => {
    if (!name || name.length < 3) {
      setError("Ім'я користувача повинно мати як мінімум 3 символи.");
      return false;
    }
    setError("");
    return true;
  };

  const handleFlag = () => {
    setFlag(true);
  };

  const handleCheckClick = () => {
    if (validateUserName(userName)) {
      updateUserName();
      setFlag(false);
    }
  };

  const handleChange = (e) => {
    setUserName(e.target.value);
  };

  const handleUpdateName = (e) => {
    if (e.key === "Enter" && validateUserName(userName)) {
      updateUserName();
      setFlag(false);
    }
  };

  const updateUserName = () => {
    const data = {
      id: auth.reqUser?.id,
      token: localStorage.getItem("token"),
      data: { fullName: userName },
    };
    dispatch(updateUser(data));
  };

  const uploadToCloudnary = (pics) => {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "dptvtq1ua");
    
    fetch("https://api.cloudinary.com/v1_1/dptvtq1ua/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setTempPicture(data.url.toString());
        const pictureData = {
          id: auth.reqUser.id,
          token: localStorage.getItem("token"),
          data: { profilePicture: data.url.toString() },
        };
        dispatch(updateUser(pictureData));
      });
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center space-x-10 bg-[#724bb9] text-white pt-16 px-10 pb-5">
        <BsArrowLeft
          className="fill-[#121212] cursor-pointer text-2xl font-bold"
          onClick={handleCloseOpenProfile}
        />
        <p className='cursor-pointer font-semibold text-[#121212]'>Профіль</p>
      </div>
      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput">
          <img
            className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
            src={auth.reqUser?.profilePicture || tempPicture || "/images/userIcon.png"}
            alt=""
          />
        </label>
        <input
          onChange={(e) => uploadToCloudnary(e.target.files[0])}
          type="file"
          id="imgInput"
          className="hidden"
        />
      </div>
      <div className="bg-[#9371c9] px-3">
        <p className="py-3 text-[#121212]">Ваше ім'я</p>
        {!flag && (
          <div className="w-full flex justify-between items-center">
            <p className="py-3 text-[#121212]">{userName}</p>
            <BsPencil
              onClick={handleFlag}
              className="fill-[#121212] cursor-pointer"
            />
          </div>
        )}
        {flag && (
          <div className="w-full flex justify-between items-center py-2">
            <input
              onKeyPress={handleUpdateName}
              onChange={handleChange}
              value={userName} // Ensure input value matches local state
              className="w-[80%] outline-none border-b-2 border-[#724bb9] p-2"
              type="text"
              placeholder="Введіть своє ім'я "
            />
            <BsCheck2
              onClick={handleCheckClick}
              className="stroke-[#121212] fill-[#121212] cursor-pointer text-2xl"
            />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className="px-3 my-5">
        <p py-10 className="text-[#b398d9]">
          Це ім'я буде видиме для тих, хто приєднується до чат-застосунку
        </p>
      </div>
    </div>
  );
};

export default Profile;