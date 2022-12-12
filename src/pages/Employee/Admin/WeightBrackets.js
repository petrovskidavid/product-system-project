import { useEffect, useState } from "react"
import Axios from "axios"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from "react-custom-alert"


// Holds validation rules for the sign up form inputs
const weightBracketValidation = yup.object().shape({
    newWeight: yup.number().integer("Please provide a whole number").min(0, "Please provide a positive number").required("Please provide a new weight"),
    newCharge: yup.number().min(0, "Please provide a positive number").required("Please provide a new charge amount"),
})


/**
 * Creates the table for the weight brackets, and inputs for the employee to be able to update the weight brackets table.
 * 
 * @returns The weight brackets table for the administrators page
 */
export default function WeightBrackets() {

    const [weightBrackets, setWeightBrackets] = useState([]) //< Holds the list of the weight brackets
    let weightBracketsTable = []                             //< Holds a list of the weight brackets in a table


    // Uses the above validation rules to handle the forms input and provides parameters to use
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(weightBracketValidation)
    })


    useEffect(() => {
        // Requests the weight brackets from the database
        Axios.get(process.env.REACT_APP_API_URL + "/api/getWeightBrackets").then((res) => {
            setWeightBrackets(res.data)
        })
    }, [])


    // Updates the weight bracket in the database when the employee adds weight brackets
    const updateWeightBrackets = (data) => {
        Axios.post(process.env.REACT_APP_API_URL + "/api/updateWeightBrackets", {
            newWeight: data.newWeight,
            newCharge: data.newCharge
        }).then(res => {

            if(!res.data.addedWeightBracket){
                // Notifies the employee that there was an error with adding the weight bracket
                toast.error("There was an error adding the new weight bracket! Make sure that the weight bracket doesn't already exist.")

            }else{
                // Reloads the page to display the new weight bracket
                window.location.reload(false)
            }
        })
    }


    // Updates the weight bracket in the database when the employee removes a weight bracket
    const removeWeightBracket = (data) => {
        console.log(data.target.id)

        Axios.post(process.env.REACT_APP_API_URL + "/api/removeWeightBracket", {
            removeWeight: data.target.id
        
        }).then(res => {

            if(res.data.removedWeightBracket){
                // Reloads the page to display the new weight brackets
                window.location.reload(false)
            }
        })
    }

    // Loops through the list of all the weight brackets
    for(let i = 0; i < weightBrackets.length; i++){

        if (i === weightBrackets.length - 1) {
            // If its the last weight bracket then it displays the corresponding table row

            weightBracketsTable.push(
                <tr key={weightBrackets[i].StartRange} >
                    <td className="weight-brackets-table-range">
                        {"Over " + weightBrackets[i].StartRange + " lbs"}
                    </td>
                    <td className="weight-brackets-table-charge">
                        {weightBrackets[i].Charge === 0 ? "Free shipping" : "$" + weightBrackets[i].Charge.toFixed(2)}
                    </td>
                    <td>
                        <button id={weightBrackets[i].StartRange} className="weight-brackets-remove-button" onClick={removeWeightBracket}>Remove</button>
                    </td>
                </tr>
            )
        } else {
            // Otherwise it displays the row with the starting and ending weight for the table row

            weightBracketsTable.push(
                <tr key={weightBrackets[i].StartRange}>
                    <td className="weight-brackets-table-range">
                        {"From " + weightBrackets[i].StartRange + " to " + weightBrackets[i + 1].StartRange + " lbs"}
                    </td>
                    <td className="weight-brackets-table-charge">
                        {weightBrackets[i].Charge === 0 ? "Free shipping" : "$" + weightBrackets[i].Charge.toFixed(2)}
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
            <div className="weight-brackets-title"><span className="bold">Administration:</span> Weight Brackets</div>
            <div className="weight-brackets-container">
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