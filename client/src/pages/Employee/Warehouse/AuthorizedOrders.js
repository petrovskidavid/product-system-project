import { useEffect, useState } from "react"
import Axios from "axios";
import OrderCard from "../../../components/OrderCard"

export default function AuthorizedOrders() {

    const [ordersData, setOrdersData] = useState([])

    useEffect(() => {

        Axios.get("http://localhost:8800/api/retrieveOrders?orderStatus=authorized").then((res) => {
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
                name={order.Name}
                timeStamp={order.TimeStamp}
                totalWeight={order.ItemsTotalWeight}
                orderTotal={order.OrderTotal}
                orderStatus={order.OrderStatus}
                orderSubtotal={order.ItemsTotal}
                orderCharge={order.ShippingCharge}
                shippingAddress={order.ShippingAddress}
            />
        )
    })

    return (
        <div className="warehouse-orders">
            <div className="warehouse-orders-label">
                <span className="bold">Warehouse:</span> Orders
            </div>

            <div className="warehouse-order-cards-container">
                {orderCards}
            </div>
        </div>
    )
}