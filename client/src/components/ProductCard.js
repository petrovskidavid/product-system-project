function ProductCard(props) {


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
            <br />
            <button className="product-card-button">Add to Cart</button>
        </div>
    )
}

export default ProductCard