import { useEffect, useState } from "react"
import Axios from "axios";
import OrderCard from "../../components/OrderCard"

export default function OrderCards() {

    const [ordersData, setOrdersData] = useState([])

    useEffect(() => {

        Axios.get("http://localhost:8800/api/retrieveOrders?orderStatus=all&customerEmail=" + localStorage.getItem("customerEmail")).then((res) => {
            setOrdersData(res.data)
        })
    },[])

    const orderCards = ordersData.map(order => {
    
        return (
            <OrderCard 
                key={order._id.toUpperCase()}
                orderID={order._id.toUpperCase()}
                authNum={order.AuthorizationNumber}
                timeStamp={order.TimeStamp}
                orderTotal={order.OrderTotal}
                orderStatus={order.OrderStatus}
            />
        )
    })


    return (
        <div className="customer-orders">
            <div className="customer-orders-label">
                Order History
            </div>

            <div className="customer-order-cards-container">
                {orderCards}
            </div>
        </div>
    )
}