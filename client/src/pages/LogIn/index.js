import Navbar from "../../components/Navbar"
import LogInForm from "./LogInForm"
import "../../assets/css/FormPages.css"

export default function LogInPage() {

    if(localStorage.getItem("user") != null){
        localStorage.removeItem("user")
        localStorage.removeItem("customer-name")
    }

    return (
        <div>
            <Navbar />
            <LogInForm />
        </div>
    )
}