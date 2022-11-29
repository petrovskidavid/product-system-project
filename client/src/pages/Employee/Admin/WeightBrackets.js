import { useEffect, useState } from "react"
import Axios from "axios"
import "../../../assets/css/AdminPage.css"

export default function WeightBrackets() {

    const [weightBrackets, setWeightBrackets] = useState([]) //< Holds the list of all the products
    let weightBracketsTable = []


    // Only calls once per render of the component
    useEffect(() => {

        Axios.get("http://localhost:8800/api/getWeightBrackets").then((res) => {
            console.log(res.data)
            setWeightBrackets(res.data)
        })
    }, [])

    // It works to print them, all we gotta do is just make it add to database with start and price, and then to check we can use this list and see where it is with <= and =>
    // in checkout add post to update order to have the total order, charge amt, total weight, and also add a function where if parm b = undefined then that is ex. 10 -> above lbs
    // add a update order and transaction request
    for(let i = 0; i < weightBrackets.length; i++){

        if (i === weightBrackets.length - 1) {
            weightBracketsTable.push(
                <tr>
                    <td className="weight-brackets-table-range">
                        {"Over " + weightBrackets[i].StartRange + " lbs"}
                    </td>
                    <td className="weight-brackets-table-charge">
                        {weightBrackets[i].Charge === 0 ? "Free shipping" : "$" + weightBrackets[i].Charge}
                    </td>
                    <td>
                        <button className="weight-brackets-remove-button" onClick={console.log("yo")}>Remove</button>
                    </td>
                </tr>
            )

            console.log(weightBrackets[i].StartRange + " lbs -> above = " + weightBrackets[i].Charge)
        
        } else {
            weightBracketsTable.push(
                <tr>
                    <td className="weight-brackets-table-range">
                        {"From " + weightBrackets[i].StartRange + " to " + weightBrackets[i + 1].StartRange + " lbs"}
                    </td>
                    <td className="weight-brackets-table-charge">
                        {weightBrackets[i].Charge === 0 ? "Free shipping" : "$" + weightBrackets[i].Charge}
                    </td>
                    <td>
                        <button className="weight-brackets-remove-button" onClick={console.log("yo")}>Remove</button>
                    </td>
                </tr>
            )
            console.log(weightBrackets[i].StartRange + " lbs -> " + weightBrackets[i + 1].StartRange + " lbs = " + weightBrackets[i].Charge)
        }         
        
    }

    return (
        <div className="weight-brackets">
            <div className="weight-brackets-container">
                <div className="weight-brackets-title"><span className="bold">Weight Brackets</span></div>
                <table className="weight-brackets-table">
                    <tbody>
                        {
                            weightBracketsTable.map(tableRow => {
                                return tableRow
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    

    )
}