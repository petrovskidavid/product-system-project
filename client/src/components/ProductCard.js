import { useState } from "react"
import Axios from "axios"

export default function ProductCard(props) {
    console.log(props)
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
            console.log(res)
        })
    }

    // Checks the avaliability of the product and updates it status on the screen
    if (props.quantity > 15) {
        stockStatus = <div className="product-card-in-stock">In Stock</div>
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
            <br />
            <br />
            <div className="product-card-description">{props.description}</div>
            <br />
            Weight: <div className="bold">{props.weight} lbs</div>
            <br />
            Price: <div className="bold">${props.price}</div>
            {stockStatus}
            <br />
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