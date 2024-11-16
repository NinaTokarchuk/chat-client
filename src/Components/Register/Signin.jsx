import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { currentUser, login } from "../../Redux/Auth/Action";
import { useDispatch, useSelector } from "react-redux";

const Signin = () => {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [inputData, setInputData] = useState({ email: "", password: "" });
    const { auth } = useSelector(store => store);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handleSubmit");
        console.log(inputData);
        dispatch(login(inputData));
        // if (auth.reqUser?.fullName) {
        //     setOpenSnackBar(true);
        // }
    }
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData((values) => ({ ...values, [name]: value }))
    }
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
            <div className="flex justify-center h-screen items-center">
                <div className="w-[30%] p-10 shaddow-md bg-white">
                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-5 ">
                        <div>
                            <p className="mb-2 text-[#1c1821]">Електронна адреса</p>
                            <input
                                placeholder="Введіть свою електронну адресу"
                                onChange={(e) => handleChange(e)}
                                value={inputData.email}
                                name="email"
                                type="text" className="py-2 outline outline-[#724bb9] w-full rounded-md border" />
                        </div>

                        <div>
                            <p className="mb-2 text-[#1c1821]">Пароль</p>
                            <input
                                placeholder="Введіть свій пароль"
                                onChange={(e) => handleChange(e)}
                                value={inputData.password}
                                name="password"
                                type="text" className="py-2 outline outline-[#724bb9] w-full rounded-md border" />
                        </div>

                        <div>
                            <Button type='submit' sx={{ bgcolor: "#724bb9", padding: ".5rem 0rem" }} className="w-full" variant="contained">Ввійти</Button>
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
                        severity="success"
                        sx={{ width: '100%' }} >
                        Вхід успішний!
                    </Alert>
                </Snackbar>
            </div>
        </div>
    )
}

export default Signin;