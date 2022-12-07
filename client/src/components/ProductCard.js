import { useState } from "react"
import Axios from "axios"
import { useLocation } from "react-router-dom"
import { toast } from "react-custom-alert"
import "react-custom-alert/dist/index.css"
import "../assets/css/ProductCard.css"


/**
 * Creates a card for each product depending on the current page.
 * 
 * The cards are similar for the receiving employees homepage and store front, however
 * for the store front the customer adds the product and the quantity to the cart and the
 * employee updates the inventory of the product
 * 
 * @param props.description The description of the product
 * @param props.img A link to an image of the product
 * @param props.price The price of the product
 * @param props.productID The ID of the product
 * @param props.quantity The avaliable quantity of the product
 * @param props.weight The weight of the product 
 * 
 * @returns The product card component
 */
export default function ProductCard(props) {

    const location = useLocation()                                                                     //< Holds infromation about the current url
    let stockStatus                                                                                    //< Holds the text to display the status of the stock
    let inStock = true                                                                                 //< Indicates if the product is in stock
    const [selectedQuantity, setSelectedQuantity] = useState((location.pathname === "/store" ? 1 : 0)) //< Displays the selected quantity of the product to add to cart or to update inventory
    let productCard                                                                                    //< Holds the correct product card depending on the current url
    

    const handleChange = (e) => {
        setSelectedQuantity(e.target.value)
    }
    

    if(location.pathname === "/store"){
        // Creates the product card for the store front

        // Adds the selected quantity of the product to the customers cart
        const addToCart = async () => {
            await Axios.post("http://localhost:8800/api/addToCart", {
                email: localStorage.getItem("customerEmail"),
                productID: props.productID,
                productDesc: props.description,
                weight: props.weight,
                price: props.price,
                quantity: parseInt(selectedQuantity)
            }).then(res => {
                if (res.data.addedToCart){
                    // Succesfully added the selcted quantity of the product to the cart

                    toast.success("Added "+ res.data.quantity + " of " + props.description + " to your cart!")
                }   
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

        // Ensures that the customer cannot put more than the avaliable quantity in their cart
        if(selectedQuantity > props.quantity)
        {
            setSelectedQuantity(props.quantity)
        }

        productCard = (
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

    } else if (location.pathname === "/emp/receiving"){
        // Creates the product card for receiving employees homepage

        // Upates the avaliable inventory of the selected product
        const updateQuantity = async () => {
            await Axios.post("http://localhost:8800/api/updateProductQuantity", {
                productID: props.productID,
                incQuantity: parseInt(selectedQuantity)
            }).then(res => {
                if(!res.data.updateQuantity){
                    // There was an error trying to update the quantity

                    toast.error("Error occured while updating the quantity of " + props.description + ". Try again later!")
                }
            })
        }

        // Checks the avaliability of the product and updates it status on the screen
        if (props.quantity > 15) {
            stockStatus = <div className="product-card-in-stock">{props.quantity} avaliable</div>
        }
        else if (props.quantity > 0 && props.quantity <= 15) {
            stockStatus = <div className="product-card-low-stock">{props.quantity} avaliable</div>
        }
        else {
            stockStatus = <div className="product-card-no-stock">Out of Stock</div>
            inStock = false
        }

        productCard = (
            <div className="product-card">
                <img src={props.img} alt={props.description} className="product-card-img" />

                <div className="product-card-description">{props.description}</div>

                <div className="product-weight"><span className="bold">Weight:</span> {props.weight} lbs</div>

                <div className="product-price"><span className="bold">Price:</span> ${props.price}</div>
                {stockStatus}

                <div>
                    <form>
                        <input className="quantity-selected" type="number" min="0" value={selectedQuantity}  onChange={handleChange} />
                        {selectedQuantity === 0 ? 
                            <button className="product-card-button" onClick={updateQuantity} disabled>Add Quantity</button> :
                            <button className="product-card-button" onClick={updateQuantity} >Add Quantity</button>
                        }
                    </form>
                </div>
                
            </div>
        )
    }
    

    return (
        productCard
    )
}