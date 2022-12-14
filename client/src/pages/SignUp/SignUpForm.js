import { useState } from "react"
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


/**
 * Creates a customer sign up form to create a new account with a unique email address.
 * 
 * Provides redirect link to the customer login page.
 * 
 * @returns The customer sign up form
 */
export default function SignUpForm() {

    const nav = useNavigate()                                       //< Holds functions to be able to navigate to different pages
    const [addedCustomerErr, setAddedCustomerErr] = useState(false) //< Holds a boolean indicating if an error occured when adding a customer


    // Removes all localStorage items connected to user login info
    localStorage.removeItem("customerName")
    localStorage.removeItem("customerEmail")


    // Uses the above validation rules to handle the forms input and provides parameters to use
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signUpValidation)
    })


    // Creates the new customers account
    const submitSignUp = async (data) => {

        // Sends post request to the backend to handle the data for sign up and awaits a response
        await Axios.post("http://localhost:8800/api/signup", {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password

        }).then((res) => {
            if(!res.data.addedCustomer){

                // Indicates that the customer couldn't be added based on the response recieved
                setAddedCustomerErr(true)
            
            } else {

                // Indicates that the customer was added based on the response recieved
                setAddedCustomerErr(false)
                localStorage.setItem("customerEmail", data.email)
                localStorage.setItem("customerName", data.firstName + " " + data.lastName)

                // Redirects client
                nav("/store")
            }
        })
    }

    
    return (
        <div className="form">
            <div className="form-error">
                <br />
                {addedCustomerErr && "The email address is already in use"}
                <br />
            </div>
            <form method="POST" onSubmit={handleSubmit(submitSignUp)}>
                <div className="form-title">
                    Sign Up
                </div>

                <input
                    {...register('firstName')}
                    placeholder="First Name"
                    type="text"
                />
                <div className="form-error">
                    {errors.firstName?.type === "max" ? "Exceeds character limit of 255" : errors.firstName?.message}
                </div>

                <input 
                    {...register('lastName')}
                    placeholder="Last Name"
                    type="text"
                />
                <div className="form-error">
                    {errors.lastName?.type === "max" ? "Exceeds character limit of 255" : errors.lastName?.message}
                </div>

                <input 
                    {...register('email')}
                    placeholder="Email"
                    type="text"
                />
                <div className="form-error">
                    {errors.email?.type === "email" ? "Invalid email" : errors.email?.message}
                </div>

                <input 
                    {...register('password')}
                    placeholder="Password"
                    type="password"
                />
                <div className="form-error">
                    {errors.password?.type && errors.password?.type === "required" && "Please create a password"}
                    {errors.password?.type && errors.password?.type === "min" && "Passwords is too short"}
                    {errors.password?.type && errors.password?.type === "max" && "Passwords is too long"}
                </div>

                <input 
                    {...register('confirmPassword')}
                    placeholder="Confirm Password"
                    type="password"
                />
                <div className="form-error">
                    {errors.confirmPassword?.type && errors.confirmPassword?.type === "oneOf" && "The passwords don't match"}
                </div>
                
                <input 
                        type="submit" 
                        value="Sign Up" 
                        className="form-btn"
                />

                <div className="redirect-form">
                    <div className="login-redirect-form">
                        Already have an account? <a href="/">Log in here</a>
                    </div>
                </div>
            </form>
        </div>
    )
}