import { useNavigate } from "react-router-dom";
import Axios from "axios"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'


// Holds validation rules for the sign up form inputs
const signUpValidation = yup.object().shape({
    firstName: yup.string().max(255).required("Please provide your first name"),
    lastName: yup.string().max(255).required("Please provide your last name"),
    email: yup.string().email().max(255).required("Please provide your email"),
    password: yup.string().min(8).max(25).required("Please create a password"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null])
})


export default function SignUpForm() {

    const nav = useNavigate() //< Used to redirect client

    // Uses the above validation rules to handle the forms input and provides parameters to use
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signUpValidation)
    })

    // Runs when the submit button is clicked
    const submitSignUp = async (data) => {

        // Sends post request to the backend to handle the data for sign up and awaits a response
        await Axios.post("http://localhost:8800/api/signup", {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password
        }).then((res) => {
            console.log(res)
            if(!res.data.addedCustomer){

                // Indicates that the customer couldn't be added based on the response recieved
                localStorage.setItem("addedCustomer", false)
                localStorage.removeItem("customer-name")
                localStorage.removeItem("user")
            }
            else
            {

                // Indicates that the customer was added based on the response recieved
                localStorage.setItem("user", data.email)
                localStorage.setItem("customer-name", data.firstName + " " + data.lastName)
                localStorage.setItem("addedCustomer", true)

                // Redirects client
                nav("/store")
            }
        })
    }

    
    return (
        <div className="form">
            <div className="form-error">
                <br />
                {localStorage.getItem("addedCustomer") === "false" && "The email address is already in use"}
                <br />
                </div>
            <form method="POST" onSubmit={handleSubmit(submitSignUp)}>
                <div className="form-title">
                    Sign Up
                </div>

                <div className="form-error">
                    {errors.firstName?.type === "max" ? "Exceeds character limit of 255" : errors.firstName?.message}
                </div>
                <input
                    {...register('firstName')}
                    placeholder="First Name"
                    type="text"
                />

                <div className="form-error">
                    {errors.lastName?.type === "max" ? "Exceeds character limit of 255" : errors.lastName?.message}
                </div>
                <input 
                    {...register('lastName')}
                    placeholder="Last Name"
                    type="text"
                />

                <div className="form-error">
                    {errors.email?.type === "email" ? "Invalid email" : errors.email?.message}
                </div>
                <input 
                    {...register('email')}
                    placeholder="Email"
                    type="text"
                />

                <div className="form-error">
                    {errors.password?.type && errors.password?.type === "required" && "Please create a password"}
                    {errors.password?.type && errors.password?.type === "min" && "Passwords is too short"}
                    {errors.password?.type && errors.password?.type === "max" && "Passwords is too long"}
                </div>
                <input 
                    {...register('password')}
                    placeholder="Password"
                    type="password"
                />
                <div className="form-error">
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
                        className="form-btn"
                />

                <div className="redirect-form">
                    Already have an account? <a href="/">Log in here</a>
                </div>
            </form>
        </div>
    )
}