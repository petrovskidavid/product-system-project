import "../assets/css/ProductCard.css"

export default function ProductCard(props) {

    let stockStatus     //< Holds the text to display the status of the stock
    let inStock = true  //< Indicates if the product is in stock

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
            {stockStatus}
            <br />
            Price: <div className="bold">${props.price}</div>
            <br />
            {inStock && <button className="product-card-button">Add to Cart</button>}
        </div>
    )
}