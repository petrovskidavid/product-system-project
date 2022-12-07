import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import CartItemCard from "../../../components/CartItemCard"


/**
 * Creates a list of all the cart cards for the customers cart.
 * 
 * @returns A list of all the cart card components for the customers cart
 */
export default function CartItemCards() {

    const nav = useNavigate()                                           //< Holds functions to be able to navigate to different pages
    const [cartItemsData, setCartItemsData] = useState([])              //< Holds the list of all the products
    const [productsData, setProductsData] = useState([])                //< Holds the list of all the products
    const [retrievedProducts, setRetrievedProducts] = useState(false)   //< Holds info if the products were retrieved or not
    const [retrievedCartItems, setRetrievedCartItems] = useState(false) //< Holds info if the cart items were retrieved or not
    let cartItemCards                                                   //< Holds a list of all the cart cards
    let totalItems = 0                                                  //< Holds the total number of items in the customers cart
    let totalPrice = 0                                                  //< Holds the total price of all the items in the customers cart
    

    useEffect(() => {

        // Requests a list of all the products in the database
        Axios.get("http://localhost:8800/api/getProducts").then((res) => {
            setProductsData(res.data)
            setRetrievedProducts(true)
        })

        // Requests a list of all the products in the database
        Axios.get("http://localhost:8800/api/getCart?email=" + localStorage.getItem("customerEmail")).then((res) => {
            setCartItemsData(res.data)
            setRetrievedCartItems(true)
        })

    }, [])


    // Checks if all the needed data was retrieved
    if(retrievedCartItems && retrievedProducts){

        // Filters through all the products
        cartItemCards = cartItemsData.map((cartItem) => {

            let productInCart = productsData.find(product => cartItem.ProductID === product.number)

            totalItems += cartItem.Quantity
            totalPrice += (productInCart.price * cartItem.Quantity)

            if (productInCart.Quantity === 0)
            {
                return null
            }
    
            // Loops through all the above filtered products and creates product cards for each
            return (
                <CartItemCard 
                    key={cartItem.ProductID}
                    productID={cartItem.ProductID}
                    img={productInCart.pictureURL}
                    description={productInCart.description}
                    weight={productInCart.weight}
                    price={productInCart.price}
                    quantity={productInCart.Quantity}
                    selectedQuantity={cartItem.Quantity}
                    orderID={cartItem.OrderID}
                />
            )
        })
    }
    
    // The infromation to display if a cart is not empty
    const nonEmpty = (
                        <div className="cart">
                            <div className="checkout-container-cart">
                                <div className="checkout-label-cart">
                                    <span className="bold">Cart Total ({totalItems} Items):</span> ${totalPrice.toFixed(2)}
                                </div>

                                <button className="checkout-button-cart" onClick={() => {nav("/checkout")}}>Checkout</button>
                            </div>

                            <div className="cart-item-cards-container">
                                {cartItemCards}
                            </div>
                        </div>
                    )
    
    // The infromation to display if a cart is empty
    const empty = (
                    <div className="cart">
                        <div className="checkout-container-cart">
                            <div className="checkout-label-cart-empty">
                                <span className="bold">Your cart is empty! Visit our store page and shop for products!</span>
                            </div>
                        </div>
                    </div>
                )

                
    return (
        <div>
            {totalItems === 0 ? empty : nonEmpty}
        </div>
    )
}