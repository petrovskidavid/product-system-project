import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import "../../assets/css/ErrorPage.css"

export default function ErrorPage() {

    const nav = useNavigate()

    return (
        <div>
            <Navbar showDropdown={false}/>
            <div className="err">
                <div className="err-label">404 Error</div>
                <div className="err-desc">Sorry! The page you were looking for doesn't exists.</div>
                <div className="err-desc">Please log in to continue.</div>
                <button onClick={() => nav("/")} className="customer-login-button">Customer Log In</button>
                <button onClick={() => nav("/emp/login")} className="emp-login-button">Employee Log In</button>
            </div>
        </div>
    )
}