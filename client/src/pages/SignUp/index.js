import Navbar from "../../components/Navbar"
import SignUpForm from "./SignUpForm"
import "../../assets/css/FormPages.css"


/**
 * Creates the customer sign up page.
 * 
 * @returns The customer sign up page
 */
export default function SignUpPage() {

    return (
        <div>
            <Navbar showDropdown={false}/>
            <SignUpForm />
        </div>
    )
}