import { useState } from "react"
import Axios from "axios"
import "react-custom-alert/dist/index.css"


/**
 * Creates a card for each item in the customers cart.
 * 
 * The cart contains an image of the product, the products description, weight, price, and
 * the quantity that the user selected with buttons that enable the user to update the quantity.
 * 
 * @param props.productID The ID of the product
 * @param props.img A link to the image of the product
 * @param props.description The descriptions of the product
 * @param props.weight The weight of the product
 * @param props.price The price per item of the proudct
 * @param props.quantity The avaliable quantity of the product
 * @param props.selectedQuantity The amount the customer selected to purchase of this product
 * @param props.orderID The order ID associated with the customers cart 
 * 
 * @return The card component for the product in the customers cart
 */
export default function CartItemCard(props) {

    let stockStatus                                                                  //< Holds the text to display the status of the stock
    const [selectedQuantity, setSelectedQuantity] = useState(props.selectedQuantity) //< Holds the customers selected quantity

    const handleChange = (e) => {
        setSelectedQuantity(e.target.value)
    }

    // Updates the selected quantity of a product if the customers updates their selected quantity field
    const updateCart = () => {
        Axios.post(process.env.REACT_APP_API_URL + "/api/updateCart", {
            OrderID: props.orderID,
            ProductID: props.productID,
            newQuantity: parseInt(selectedQuantity)
        })  
    }

    // If the customer has selected more than the avaliable quantity this updates it to hold whatever is in stock right now
    const updateCartOverflow = (newQuantity) => {
        Axios.post(process.env.REACT_APP_API_URL + "/api/updateCart", {
            OrderID: props.orderID,
            ProductID: props.productID,
            newQuantity: newQuantity
        })  
    }


    // Removes the product from the customers cart
    const removeFromCart = async () => {
        await Axios.post(process.env.REACT_APP_API_URL + "/api/removeFromCart", {
            OrderID: props.orderID,
            ProductID: props.productID
        })
    }


    // Checks the avaliability of the cart-item and updates it status on the screen
    if (props.quantity > 15) {
        stockStatus = <div className="cart-item-card-in-stock">In Stock! {props.quantity} avaliable</div>
    }
    else if (props.quantity > 0 && props.quantity <= 15) {
        stockStatus = <div className="cart-item-card-low-stock">Hurry! Only {props.quantity} left</div>
    }
    else {
        stockStatus = <div className="cart-item-card-no-stock">Out of Stock</div>
        removeFromCart()
    }


    // Checks if the customer tried to select more than the avaliable quantity of a product and updates the field to the max in stock at the moment
    if(selectedQuantity > props.quantity)
    {
        updateCartOverflow(props.quantity)
        setSelectedQuantity(props.quantity)
    }
    

    return (
        <div className="cart-item-card">
            <img src={props.img} alt={props.description} className="cart-item-card-img" />

            <div className="cart-item-card-description">{props.description}</div>
            
            <div className="cart-item-weight"><span className="bold">Weight:</span> {props.weight} lbs</div>
            
            <div className="cart-item-price"><span className="bold">Price:</span> ${props.price}</div>
            {stockStatus}

            <div>
                <form>
                    <input className="quantity-selected" type="number" min="1" max={props.quantity} value={selectedQuantity}  onChange={handleChange} />
                    <button className="cart-item-card-update-button" onClick={updateCart}>Update</button>
                    <button className="cart-item-card-remove-button" onClick={removeFromCart}>Remove</button>
                </form>
            </div>
        </div>
    )
}