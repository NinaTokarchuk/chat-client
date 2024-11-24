import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from "react-redux";
import { currentUser, register } from "../../Redux/AuthRedux/Action";
import "./Signup.css";

const Signup = () => {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [inputData, setInputData] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { auth } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!inputData.fullName || inputData.fullName.length < 3) {
      newErrors.fullName = "Ім'я користувача повинно мати як мінімум 3 символи.";
    }

    if (!inputData.email || !inputData.email.includes('@')) {
      newErrors.email = "Введіть дійсну електронну адресу.";
    }

    if (!inputData.password || inputData.password.length < 8) {
      newErrors.password = "Пароль повинен бути не менше 8 символів.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(register(inputData));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((values) => ({ ...values, [name]: value }));
  };

  const handleSnackbarClose = () => {
    setOpenSnackBar(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (auth.reqUser?.fullName) {
      setOpenSnackBar(true);
      navigate("/");
    }
  }, [auth.reqUser, navigate]);

  return (
    <div>
      <div>
        <div className="flex flex-col justify-center min-h-screen items-center">
          <div className="signup-container w-[30%] p-10 shadow-md bg-white">
            <form onSubmit={handleSubmit} className="signup-form space-y-5">
              <div>
                <p className="text-[#1c1821] mb-2">Ім'я користувача</p>
                <input
                  className="signup-input py-2 px-3 outline outline-[#724bb9] w-full rounded-md border-1"
                  type="text"
                  placeholder="Введіть ім'я користувача"
                  name="fullName"
                  onChange={handleChange}
                  value={inputData.fullName}
                />
                {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <p className="mb-2 text-[#1c1821]">Електронна адреса</p>
                <input
                  className="signup-input py-2 px-3 outline outline-[#724bb9] w-full rounded-md border-1"
                  type="text"
                  placeholder="Введіть свою електронну адресу"
                  name="email"
                  onChange={handleChange}
                  value={inputData.email}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>

              <div>
                <p className="mb-2 text-[#1c1821]">Пароль</p>
                <input
                  className="signup-input py-2 px-2 outline outline-[#724bb9] w-full rounded-md border-1"
                  type="password"
                  placeholder="Введіть свій пароль"
                  name="password"
                  onChange={handleChange}
                  value={inputData.password}
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}
              </div>

              <div>
                <Button
                  type="submit"
                  sx={{ bgcolor: "#724bb9", padding: ".5rem 0rem" }}
                  className="signup-button w-full"
                  variant="contained"
                >
                  Створити новий акаунт
                </Button>
              </div>
            </form>
            <div className="flex space-x-3 items-center mt-5">
              <p>Вже маєте акаунт?</p>
              <Button variant="text" sx={{ color: "#724bb9" }} onClick={() => navigate("/signin")}>
                Ввійти
              </Button>
            </div>
          </div>
        </div>

        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }} >
            Акаунт успішно створено!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Signup;