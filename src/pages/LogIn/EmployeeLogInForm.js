import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Axios from "axios"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'


// Holds validation rules for the log in form inputs for the employee
const logInValidation = yup.object().shape({
    empID: yup.string().min(7, "Employee ID's are a minimum of 7 characters").required("Please provide your employee ID"),
    password: yup.string().required("Please provide your password")
})


/**
 * Creates a login form for the employee and checks their login information.
 * 
 * Provides redirect link to the customer login page.
 * 
 * @returns The login form for the employee
 */
export default function EmployeeLogInForm() {

    const nav = useNavigate()                                     //< Holds functions to be able to navigate to different pages
    const [empIDErr, setEmpIDErr] = useState(false)               //< Holds a boolean indicating if an email error occured while logging in
    const [verificationErr, setVerificationErr] = useState(false) //< Holds a boolean indicating if a password/empID verificaiton error occured while logging in
    

    // Removes all localStorage items connected to user login info for employee
    localStorage.removeItem("employeeName")
    localStorage.removeItem("employeeID")
    localStorage.removeItem("employeeType")


    // Uses the above validation rules to handle the forms input and provides parameters to use
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(logInValidation)
    })


    // Checks the employees ID and password for login
    const submitLogIn = async (data) => {

        // Sends post request to the backend to handle the data for log in and awaits a response
        await Axios.post(process.env.REACT_APP_API_URL + "/api/login", {
            empID: data.empID,
            password: data.password,
            type: "employee"

        }).then((res) => {
            if (res.data.loginVerified) {

                // Indicates that there were no errors
                setVerificationErr(false)
                setEmpIDErr(false)

                // Adds data to localStorage for later use
                localStorage.setItem("employeeName", res.data.empName)
                localStorage.setItem("employeeID", res.data.empID)
                localStorage.setItem("employeeType", res.data.empType)


                if(res.data.empType === "admin"){
                    // Redirects client
                    nav("/emp/admin")

                } else if(res.data.empType === "receiving"){
                    // Redirects client
                    nav("/emp/receiving")

                } else if(res.data.empType === "workstations"){
                    // Redirects client
                    nav("/emp/workstations")
                    
                }

            } else if (res.data.loginVerified === false) {

                // Indicates that there was a password/empID verification error
                setVerificationErr(true)
                setEmpIDErr(false)
            
            } else if (res.data.employeeExists === false) {

                // Indicates that the empID doesn't exist in our database
                setVerificationErr(false)
                setEmpIDErr(true)
            }
        })
    }


    return (
        <div className="form">
            <div className="form-error">
                <br />
                <br />
                {verificationErr && "The employee ID and password you entered did not match our records"}
                {empIDErr && "The employee ID you entered is not in our records"}
                </div>
            <form method="POST" onSubmit={handleSubmit(submitLogIn)}>
                <div className="form-title">
                    Employee Log In
                </div>

                <input 
                    {...register("empID")}
                    placeholder="Employee ID"
                    type="text"
                />
                <div className="form-error">
                    {errors.empID?.type === "length" ? "The employee ID must be 7 characters" : errors.empID?.message}
                </div>


                <input 
                    {...register('password')}
                    placeholder="Password"
                    type="password"
                />
                <div className="form-error">
                    {errors.password?.type && errors.password?.type === "required" && "Please provide your password"}
                </div>

                <input 
                        type="submit" 
                        value="Log In" 
                        className="form-btn"
                />

                <div className="redirect-form">
                    <div className="customer-login-redirect-form">
                        Are you a customer? <a href="/">Log in here</a>
                    </div>
                </div>
            </form>
        </div>
    )
}