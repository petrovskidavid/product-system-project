import { useEffect } from "react"
import { toast, ToastContainer } from "react-custom-alert"
import Navbar from "../../components/Navbar"
import SignUpForm from "./SignUpForm"
import "../../assets/css/FormPages.css"


/**
 * Creates the customer sign up page.
 * 
 * @returns The customer sign up page
 */
export default function SignUpPage() {

    useEffect(() => {

        // Warns the user about this website being a demo
        toast.warning("Do NOT provide your real email address and do NOT use one of your real passwords! This is a project website!")
    }, [])


    return (
        <div>
            <Navbar showDropdown={false}/>
            <ToastContainer floatingTime={5000} />
            <SignUpForm />
        </div>
    )
}