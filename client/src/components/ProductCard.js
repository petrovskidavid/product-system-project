import { useState } from "react"
import Axios from "axios"
import { toast } from "react-custom-alert"
import "react-custom-alert/dist/index.css"

export default function ProductCard(props) {

    let stockStatus     //< Holds the text to display the status of the stock
    let inStock = true  //< Indicates if the product is in stock
    const [selectedQuantity, setSelectedQuantity] = useState(1)

    const handleChange = (e) => {
        setSelectedQuantity(e.target.value)
    }

    const addToCart = async () => {
        await Axios.post("http://localhost:8800/api/addToCart", {
            email: localStorage.getItem("customerEmail"),
            productID: props.productID,
            price: props.price,
            quantity: parseInt(selectedQuantity)
        }).then(res => {

            console.log(res.data)
            if (res.data.addedToCart)
                toast.success("Added "+ res.data.quantity + " of " + props.description + " to your cart")
        })
    }

    // Checks the avaliability of the product and updates it status on the screen
    if (props.quantity > 15) {
        stockStatus = <div className="product-card-in-stock">In Stock! {props.quantity} avaliable</div>
    }
    else if (props.quantity > 0 && props.quantity <= 15) {
        stockStatus = <div className="product-card-low-stock">Hurry! Only {props.quantity} left</div>
    }
    else {
        stockStatus = <div className="product-card-no-stock">Out of Stock</div>
        inStock = false
    }
    

    return (
        
        <div className="product-card">
            <img src={props.img} alt={props.description} className="product-card-img" />

            <div className="product-card-description">{props.description}</div>

            <div className="product-weight"><span className="bold">Weight:</span> {props.weight} lbs</div>

            <div className="product-price"><span className="bold">Price:</span> ${props.price}</div>
            {stockStatus}

            {
                inStock 
                && 
                <div>
                    <input className="quantity-selected" type="number" min="1" max={props.quantity} value={selectedQuantity}  onChange={handleChange} />
                    <button className="product-card-button" onClick={addToCart} >Add to Cart</button>
                </div>
            }
        </div>
    )
}