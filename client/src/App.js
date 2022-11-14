import { useEffect, useState } from "react"
import Axios from "axios";
import './App.css';
import Navbar from "./components/Navbar"
import ProductCard from "./components/ProductCard"

function App() {

  const [productsData, setProductsData] = useState([])

  useEffect(() => {
    
    Axios.get("http://localhost:8800/api/getProducts").then((res) => {
      setProductsData(res.data)
    })
  }, [])

  const productCards = productsData.map((product) => {

    return (
      <ProductCard 
        key={product.number}
        img={product.pictureURL}
        description={product.description}
        weight={product.weight}
        price={product.price}
        quantity={product.Quantity}
      />
    )
  })

  return (
    <div className="App">
      <Navbar />
      <div className="product-card-container">
        {productCards}
      </div>
    </div>
  )
}

export default App;