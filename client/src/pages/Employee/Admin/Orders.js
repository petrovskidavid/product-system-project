import { useEffect, useState } from "react"
import Axios from "axios";
import OrderCard from "../../../components/OrderCard"

export default function Orders() {

    const [ordersData, setOrdersData] = useState([])

    useEffect(() => {

        Axios.get("http://localhost:8800/api/retrieveOrders?orderStatus=all").then((res) => {
            console.log(res.data)
            setOrdersData(res.data)
        })
    },[])

    const orderCards = ordersData.map(order => {
        console.log(order)

        return (
            <OrderCard 
                key={order._id.toUpperCase()}
                orderID={order._id.toUpperCase()}
                authNum={order.AuthorizationNumber}
                email={order.Email}
                timeStamp={order.TimeStamp}
                totalWeight={order.ItemsTotalWeight}
                orderTotal={order.OrderTotal}
                orderStatus={order.OrderStatus}
            />
        )
    })


    return (
        <div className="admin-orders">
            <div className="admin-orders-label">
                <span className="bold">Administration:</span> Orders
            </div>

            <div className="admin-order-cards-container">
                {orderCards}
            </div>
        </div>
    )
}