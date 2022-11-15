import { useNavigate } from "react-router-dom";
import Axios from "axios"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Navbar from "../components/Navbar"
import "./SignUpPage.css"

const signUpValidation = yup.object().shape({
    firstName: yup.string().max(255).required("This field is required"),
    lastName: yup.string().max(255).required("This field is required"),
    email: yup.string().email().max(255).required("This field is required"),
    password: yup.string().min(8).max(25).required("This field is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null])
})


export default function SignUpPage() {

    const nav = useNavigate()

    const submitSignUp = async (data) => {
        await Axios.post("http://localhost:8800/api/signup", {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password
        }).then((res) => {
            if(res.data.affectedRows === 0){
                console.log("invalid")
                localStorage.setItem("user", "invalid")
            }
            else
            {
                localStorage.setItem("user", data.email)
                localStorage.setItem("users-name", data.firstName + " " + data.lastName)
                nav("/store")
            }
        })
    }


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signUpValidation)
    })

    return (
        <div>
            <Navbar />
            <div className="sign-up">
                <div className="sign-up-error">
                    <br />
                    {localStorage.getItem("user") === "invalid" && "The email address is already in use"}
                    <br />
                 </div>
                <form method="POST" onSubmit={handleSubmit(submitSignUp)}>
                    <div className="sign-up-title">
                        Create an Account!
                    </div>

                    <div className="sign-up-error">{errors.firstName?.type === "max" ? "Exceeds character limit of 255" : errors.firstName?.message}</div>
                    <input
                        {...register('firstName')}
                        placeholder="First Name"
                        type="text"
                    />

                    <div className="sign-up-error">{errors.lastName?.type === "max" ? "Exceeds character limit of 255" : errors.lastName?.message}</div>
                    <input 
                        {...register('lastName')}
                        placeholder="Last Name"
                        type="text"
                    />

                    <div className="sign-up-error">
                        {errors.email?.type === "email" ? "Invalid email" : errors.email?.message}
                    </div>
                    <input 
                        {...register('email')}
                        placeholder="Email"
                        type="text"
                    />

                    <div className="sign-up-error">
                        {errors.password?.type && errors.password?.type === "required" && "This field is required"}
                        {errors.password?.type && errors.password?.type === "min" && "Passwords is too short"}
                        {errors.password?.type && errors.password?.type === "max" && "Passwords is too long"}
                    </div>
                    <input 
                        {...register('password')}
                        placeholder="Password"
                        type="password"
                    />
                    <div className="sign-up-error">
                        {errors.confirmPassword?.type && errors.confirmPassword?.type === "required" && "This field is required"}
                        {errors.confirmPassword?.type && errors.confirmPassword?.type === "oneOf" && "The passwords don't match"}
                    </div>
                    <input 
                        {...register('confirmPassword')}
                        placeholder="Confirm Password"
                        type="password"
                    />
                    
                    <input 
                            type="submit" 
                            value="Sign Up" 
                            className="sign-up-btn"
                    />
                </form>
            </div>
        </div>
    )
}