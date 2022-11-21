import Navbar from "../../components/Navbar"
import CustomerLogInForm from "./CustomerLogInForm"
import EmployeeLogInForm from "./EmployeeLogInForm"
import "../../assets/css/FormPages.css"

export default function LogInPage(props) {

    // Checks if any local storage for the customer or the employee exists and removes it
    if(localStorage.getItem("customerEmail") != null || localStorage.getItem("employeeID") != null){
        localStorage.removeItem("customerEmail")
        localStorage.removeItem("customerName")

        localStorage.removeItem("employeeID")
        localStorage.removeItem("employeeName")
    }


    return (
        <div>
            <Navbar />
            {props.type === "customer" ? <CustomerLogInForm /> : <EmployeeLogInForm />}
        </div>
    )
}