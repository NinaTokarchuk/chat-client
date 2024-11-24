import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { clearLoginError, currentUser, login } from "../../Redux/AuthRedux/Action";
import { useDispatch, useSelector } from "react-redux";
import "./Signin.css";

const Signin = () => {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarSeverity, setSnackBarSeverity] = useState('success');
    const [inputData, setInputData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!inputData.email || !inputData.email.includes('@')) {
            newErrors.email = "Будь ласка, введіть дійсну електронну адресу.";
        }
        if (!inputData.password) {
            newErrors.password = "Будь ласка, введіть пароль.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("handleSubmit", inputData);
            dispatch(login(inputData));
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
        if (token) dispatch(currentUser(token));
    }, [token, dispatch]);

    useEffect(() => {
        if (auth.reqUser?.fullName) {
            setSnackBarMessage('Вхід успішний!');
            setSnackBarSeverity('success');
            setOpenSnackBar(true);
            navigate("/");
        } else if (auth.loginError && !localStorage.getItem("token")) {
            setSnackBarMessage('Невірний логін або пароль.');
            setSnackBarSeverity('error');
            setOpenSnackBar(true);
            dispatch(clearLoginError());
        }
    }, [auth.reqUser, auth.loginError, navigate, dispatch]);

    return (
        <div>
            <div className="flex justify-center h-screen items-center">
                <div className="signin-container w-[30%] p-10 shadow-md bg-white">
                    <form onSubmit={handleSubmit} className="signin-form space-y-5">
                        <div>
                            <p className="mb-2 text-[#1c1821]">Електронна адреса</p>
                            <input
                                placeholder="Введіть свою електронну адресу"
                                onChange={handleChange}
                                value={inputData.email}
                                name="email"
                                type="text"
                                className="signin-input py-2 outline outline-[#724bb9] w-full rounded-md border"
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <p className="mb-2 text-[#1c1821]">Пароль</p>
                            <input
                                placeholder="Введіть свій пароль"
                                onChange={handleChange}
                                value={inputData.password}
                                name="password"
                                type="password"
                                className="signin-input py-2 outline outline-[#724bb9] w-full rounded-md border"
                            />
                            {errors.password && <p className="text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <Button
                                type='submit'
                                sx={{ bgcolor: "#724bb9", padding: ".5rem 0rem" }}
                                className="signin-button w-full"
                                variant="contained"
                            >
                                Ввійти
                            </Button>
                        </div>

                    </form>

                    <div className="flex space-x-3 items-center mt-5">
                        <p className="m-0">Створити новий акаунт</p>
                        <Button variant='text' sx={{ color: "#724bb9" }} onClick={() => navigate("/signup")}>Створити</Button>
                    </div>
                </div>
            </div>
            <div>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}>
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackBarSeverity}
                        sx={{ width: '100%' }} >
                        {snackBarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}

export default Signin;