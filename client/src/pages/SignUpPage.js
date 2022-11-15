import Axios from "axios"
import {useState} from "react"
import Navbar from "../components/Navbar"
import "./SignUpPage.css"

export default function SignUpPage() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitSignUp = (event) => {
        event.preventDefault()

        Axios.post("http://localhost:8800/api/signup", {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password
        })
    }

    return (
        <div>
            <Navbar />
            <form className="sign-up">
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <div className="sign-up-input">
                                    <label htmlFor="firstName">First Name: </label>
                                </div>
                            </td>
                            <td>
                                <div className="sign-up-input">
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        maxLength={255} 
                                        onChange={(e) => {
                                            setFirstName(e.target.value)
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="sign-up-input">
                                    <label htmlFor="lastName">Last Name: </label>
                                </div>
                            </td>
                            <td>
                                <div className="sign-up-input">
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        maxLength={255} 
                                        onChange={(e) => {
                                            setLastName(e.target.value)
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="sign-up-input">
                                    <label htmlFor="username">Username: </label>
                                </div>
                            </td>
                            <td>
                                <div className="sign-up-input">
                                    <input 
                                        type="text" 
                                        name="username" 
                                        maxLength={15} 
                                        pattern="\\S*$" 
                                        title="Avoid using spaces in your username." 
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>    
                        <tr>
                            <td>
                                <div className="sign-up-input">
                                    <label htmlFor="email">Email: </label>
                                </div>
                            </td>
                            <td>
                                <div className="sign-up-input">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        maxLength={255} 
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="sign-up-input">
                                    <label htmlFor="password">Password: </label>
                                </div>
                            </td>
                            <td>
                                <div className="sign-up-input">
                                    <input 
                                        type="password" 
                                        name="password" 
                                        minLength={8} 
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="sign-up-input">
                                    <label htmlFor="confirm-password">Confirm Password: </label>
                                </div>
                            </td>
                            <td>
                                <div className="sign-up-input">
                                    <input type="password" name="confirm-password" minLength={8} />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="sign-up-button" onClick={submitSignUp} >Sign Up!</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
        </div>
    )
}