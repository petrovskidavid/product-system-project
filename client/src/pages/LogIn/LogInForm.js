// import { useNavigate } from "react-router-dom";
import Axios from "axios"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'


// Holds validation rules for the log in form inputs
const logInValidation = yup.object().shape({
    email: yup.string().email().max(255).required("Please provide your email"),
    password: yup.string().required("Please provide your password")
})


export default function LogInForm() {

    // Uses the above validation rules to handle the forms input and provides parameters to use
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(logInValidation)
    })

    // Runs when the submit button is clicked
    const submitLogIn = async (data) => {

        // Sends post request to the backend to handle the data for log in and awaits a response
        await Axios.post("http://localhost:8800/api/login", {
            email: data.email,
            password: data.password
        }).then((res) => {

            // if(false){
            //     localStorage.removeItem("customer-name")
            //     localStorage.removeItem("user")
            // }
            // else
            // {
            //     localStorage.setItem("user", data.email)
            //     localStorage.setItem("customer-name", data.firstName + " " + data.lastName)
            //     localStorage.setItem("addedCustomer", true)
            // }
        })
    }


    return (
        <div className="form">
            <div className="form-error">
                <br />
                <br />
                </div>
            <form method="POST" onSubmit={handleSubmit(submitLogIn)}>
                <div className="form-title">
                    Log In
                </div>

                <div className="form-error">
                    {errors.email?.type === "email" ? "Invalid email" : errors.email?.message}
                </div>
                <input 
                    {...register('email')}
                    placeholder="Email"
                    type="text"
                />

                <div className="form-error">
                    {errors.password?.type && errors.password?.type === "required" && "Please provide your password"}
                </div>
                <input 
                    {...register('password')}
                    placeholder="Password"
                    type="password"
                />

                <input 
                        type="submit" 
                        value="Log In" 
                        className="form-btn"
                />

                <div className="redirect-form">
                    Don't have an account? <a href="/signup">Sign up here</a>
                </div>
            </form>
        </div>
    )
}