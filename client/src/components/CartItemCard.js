import { useState } from "react"
import Axios from "axios"
import "react-custom-alert/dist/index.css"

export default function CartItemCard(props) {

    let stockStatus     //< Holds the text to display the status of the stock
    let inStock = true  //< Indicates if the cart-item is in stock
    const [selectedQuantity, setSelectedQuantity] = useState(props.selectedQuantity)
    const [updatedCart, setUpdatedCart] = useState([])

    const handleChange = (e) => {
        setSelectedQuantity(e.target.value)
    }

    const updateCart = () => {
        Axios.post("http://localhost:8800/api/updateCart", {
            OrderID: props.orderID,
            ProductID: props.productID,
            newQuantity: parseInt(selectedQuantity)
        }).then(res => {
            console.log(res)
        })
        
    }


    const removeFromCart = async () => {

        await Axios.post("http://localhost:8800/api/removeFromCart", {
            OrderID: props.orderID,
            ProductID: props.productID
        }).then(res => {

            
        })
    }

    // Checks the avaliability of the cart-item and updates it status on the screen
    if (props.quantity > 15) {
        stockStatus = <div className="cart-item-card-in-stock">In Stock</div>
    }
    else if (props.quantity > 0 && props.quantity <= 15) {
        stockStatus = <div className="cart-item-card-low-stock">Hurry! Only {props.quantity} left</div>
    }
    else {
        stockStatus = <div className="cart-item-card-no-stock">Out of Stock</div>
        inStock = false
    }
    

    return (
        
        <div className="cart-item-card">
            <img src={props.img} alt={props.description} className="cart-item-card-img" />

            <div className="cart-item-card-description">{props.description}</div>
            
            <div className="cart-item-weight"><span className="bold">Weight:</span> {props.weight} lbs</div>
            
            <div className="cart-item-price"><span className="bold">Price:</span> ${props.price}</div>
            {stockStatus}

            <div>
                <form >
                    <input className="quantity-selected" type="number" min="1" max={props.quantity} value={selectedQuantity}  onChange={handleChange} />
                    <button className="cart-item-card-update-button" onClick={updateCart}>Update</button>
                    <button className="cart-item-card-remove-button" onClick={removeFromCart}>Remove</button>
                </form>
            </div>
        </div>
    )
}