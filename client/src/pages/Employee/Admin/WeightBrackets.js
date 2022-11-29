import { useEffect, useState } from "react"
import Axios from "axios"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from "react-custom-alert"
import "../../../assets/css/AdminPage.css"

// Holds validation rules for the sign up form inputs
const weightBracketValidation = yup.object().shape({
    newWeight: yup.number().integer("Please provide a whole number").min(0, "Please provide a positive number").required("Please provide a new weight"),
    newCharge: yup.number().min(0, "Please provide a positive number").required("Please provide a new charge amount"),
})


export default function WeightBrackets() {

    const [weightBrackets, setWeightBrackets] = useState([]) //< Holds the list of all the products
    let weightBracketsTable = []

    // Uses the above validation rules to handle the forms input and provides parameters to use
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(weightBracketValidation)
    })

    console.log(errors)
    // Only calls once per render of the component
    useEffect(() => {

        Axios.get("http://localhost:8800/api/getWeightBrackets").then((res) => {
            setWeightBrackets(res.data)
        })
    }, [])


    const updateWeightBrackets = (data) => {
        Axios.post("http://localhost:8800/api/updateWeightBrackets", {
            newWeight: data.newWeight,
            newCharge: data.newCharge
        }).then(res => {
            if(!res.data.addedWeightBracket){
                toast.error("There was an error adding the new weight bracket! Make sure that the weight bracket doesn't already exist.")
            }else{
                window.location.reload(false)
            }
        })
    }


    const removeWeightBracket = (data) => {
        console.log(data.target.id)

        Axios.post("http://localhost:8800/api/removeWeightBracket", {
            removeWeight: data.target.id
        
        }).then(res => {
            if(res.data.removedWeightBracket){
                window.location.reload(false)
            }
        })
    }

    // It works to print them, all we gotta do is just make it add to database with start and price, and then to check we can use this list and see where it is with <= and =>
    // in checkout add post to update order to have the total order, charge amt, total weight, and also add a function where if parm b = undefined then that is ex. 10 -> above lbs
    // add a update order and transaction request
    for(let i = 0; i < weightBrackets.length; i++){

        if (i === weightBrackets.length - 1) {
            weightBracketsTable.push(
                <tr key={weightBrackets[i].StartRange} >
                    <td className="weight-brackets-table-range">
                        {"Over " + weightBrackets[i].StartRange + " lbs"}
                    </td>
                    <td className="weight-brackets-table-charge">
                        {weightBrackets[i].Charge === 0 ? "Free shipping" : "$" + weightBrackets[i].Charge}
                    </td>
                    <td>
                        <button id={weightBrackets[i].StartRange} className="weight-brackets-remove-button" onClick={removeWeightBracket}>Remove</button>
                    </td>
                </tr>
            )
        } else {
            weightBracketsTable.push(
                <tr key={weightBrackets[i].StartRange}>
                    <td className="weight-brackets-table-range">
                        {"From " + weightBrackets[i].StartRange + " to " + weightBrackets[i + 1].StartRange + " lbs"}
                    </td>
                    <td className="weight-brackets-table-charge">
                        {weightBrackets[i].Charge === 0 ? "Free shipping" : "$" + weightBrackets[i].Charge}
                    </td>
                    <td>     
                        <button id={weightBrackets[i].StartRange} className="weight-brackets-remove-button " onClick={removeWeightBracket}>Remove</button>
                    </td>
                </tr>
            )
        }                 
    }

    return (
        <div className="weight-brackets">
            <div className="weight-brackets-container">
                <div className="weight-brackets-title"><span className="bold">Weight Brackets</span></div>
                <table className="weight-brackets-table">
                    <tbody>
                        {
                            weightBracketsTable
                        }
                    </tbody>
                </table>
            </div>
            <br/>
            <div className="new-weight-brackets-container">
                <form>
                    <input className="new-weight" {...register("newWeight")} placeholder="New Weight"></input>
                    <div className="form-error">
                            {errors.newWeight?.type === "typeError" ? "Must be a number" : errors.newWeight?.message}
                    </div>

                    <input className="new-charge" {...register("newCharge")} placeholder="New Charge"></input>
                    <div className="form-error">
                            {errors.newCharge?.type === "typeError" ? "Must be a number" : errors.newCharge?.message}
                    </div>

                    <button className="new-weight-bracket-add-button" onClick={handleSubmit(updateWeightBrackets)}>Add</button>
                </form>
            </div>
        </div>
    )
}