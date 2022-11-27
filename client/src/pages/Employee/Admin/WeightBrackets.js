import { useEffect, useState } from "react"
import Axios from "axios"

export default function WeightBrackets() {

    const [weightBrackets, setWeightBrackets] = useState([]) //< Holds the list of all the products


    // Only calls once per render of the component
    useEffect(() => {

        Axios.get("http://localhost:8800/api/getWeightBrackets").then((res) => {
            console.log(res.data)
            setWeightBrackets(res.data)
        })
    }, [])

    // It works to print them, all we gotta do is just make it add to database with start and price, and then to check we can use this list and see where it is with <= and =>
    // in checkout add post to update order to have the total order, charge amt, total weight, and also add a function where if parm b = undefined then that is ex. 10 -> above lbs
    for(let i = 0; i < weightBrackets.length; i++){

        if (i === weightBrackets.length - 1)
            console.log(weightBrackets[i].StartRange + " lbs -> above = " + weightBrackets[i].Charge)
        else
            console.log(weightBrackets[i].StartRange + " lbs -> " + weightBrackets[i + 1].StartRange + " lbs = " + weightBrackets[i].Charge)
        
    }

    return (
        "Weight Brackets"
    )
}