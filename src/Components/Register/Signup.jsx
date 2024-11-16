import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from "react-redux";
import { currentUser, register } from "../../Redux/Auth/Action";

const Signup = () => {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [inputData, setInputData] = useState({ fullName: "", email: "", password: "" });
    const { auth } = useSelector(store => store);
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handleSubmit", inputData);
        dispatch(register(inputData));
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData((values) => ({ ...values, [name]: value }))
    };
    const navigate = useNavigate();
    const handleSnackbarClose = () => {
        setOpenSnackBar(false);
    }
    useEffect(() => {
        if (token) dispatch(currentUser((token)))
    }, [token])

    useEffect(() => {
        if (auth.reqUser?.fullName) {
            setOpenSnackBar(true);
            navigate("/")
        }
    }, [auth.reqUser])
    return (
        <div>
            <div>
                <div className="flex flex-col justify-center min-h-screen items-center">
                    <div className="w-[30%] p-10 shadow-md bg-white">
                        <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
                            <div>
                                <p className="text-[#1c1821] mb-2">Ім'я користувача</p>
                                <input
                                    className="py-2 px-3 outline  outline-[#724bb9] w-full rounded-md border-1"
                                    type="text"
                                    placeholder="Введіть ім'я користувача"
                                    name="fullName"
                                    onChange={(e) => handleChange(e)}
                                    value={inputData.fullName} />
                            </div>

                            <div>
                                <p className="mb-2 text-[#1c1821]">Електронна адреса</p>
                                <input
                                    className="py-2 px-3 outline outline-[#724bb9] w-full rounded-md border-1"
                                    type="text"
                                    placeholder="Введіть свою електронну адресу"
                                    name="email"
                                    onChange={(e) => handleChange(e)}
                                    value={inputData.email}
                                />
                            </div>

                            <div>
                                <p className="mb-2 text-[#1c1821]">Пароль</p>
                                <input
                                    className="py-2 px-2 outline outline-[#724bb9] w-full rounded-md border-1"
                                    type="password"
                                    placeholder="Введіть свій пароль"
                                    name="password"
                                    onChange={(e) => handleChange(e)}
                                    value={inputData.password} />
                            </div>

                            <div>
                                <Button type='submit' sx={{ bgcolor: "#724bb9", padding: ".5rem 0rem" }} className="w-full" variant="contained">
                                    Створити новий акаунт
                                </Button>
                            </div>

                        </form>
                        <div className="flex space-x-3 items-center mt-5">
                            <p className="">Вже маєте акаунт?</p>
                            <Button variant='text' sx={{ color: "#724bb9" }} onClick={() => navigate("/signin")}>Ввійти</Button>
                        </div>
                    </div>
                </div>

                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}>
                    <Alert
                        onClose={handleSnackbarClose}
                        severity="success"
                        sx={{ width: '100%' }} >
                        Акаунт успішно створено!
                    </Alert>
                </Snackbar>

            </div>
        </div>
    )
}

export default Signup;