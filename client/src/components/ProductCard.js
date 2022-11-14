import "./ProductCard.css"

function ProductCard(props) {

    let stockData
    let inStock = true

    if (props.quantity > 15) {
        stockData = <div className="product-card-in-stock">In Stock</div>
    }
    else if (props.quantity > 0 && props.quantity <= 15) {
        stockData = <div className="product-card-low-stock">Hurry! Only {props.quantity} left</div>
    }
    else {
        stockData = <div className="product-card-no-stock">Out of Stock</div>
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
            {stockData}
            <br />
            Price: <div className="bold">${props.price}</div>
            <br />
            {inStock && <button className="product-card-button">Add to Cart</button>}
        </div>
    )
}

export default ProductCard