import Navbar from "../../components/Navbar"
import SignUpForm from "./SignUpForm"
import "../../assets/css/FormPages.css"

export default function SignUpPage() {

    return (
        <div>
            <Navbar showDropdown={false}/>
            <SignUpForm />
        </div>
    )
}