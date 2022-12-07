import { useEffect, useState } from "react"
import Axios from "axios";
import OrderCard from "../../../components/OrderCard"


/**
 * Creates a list of all the order cards for the customers orders.
 * 
 * @returns A list of all the order card components for the customers order history
 */
export default function OrderCards() {

    const [ordersData, setOrdersData] = useState([]) //< Holds a list of all the customers orders

    useEffect(() => {

        // Requests to get all the customers orders that have been shipped and awaiting for fullfilment
        Axios.get("http://localhost:8800/api/retrieveOrders?orderStatus=all&customerEmail=" + localStorage.getItem("customerEmail")).then((res) => {
            setOrdersData(res.data)
        })
    },[])

    // Loops through the list of all the orders and creates an order card for each
    const orderCards = ordersData.map(order => {
    
        return (
            <OrderCard 
                key={order._id.toUpperCase()}
                orderID={order._id.toUpperCase()}
                authNum={order.AuthorizationNumber}
                timeStamp={order.TimeStamp}
                totalWeight={order.ItemsTotalWeight}
                orderTotal={order.OrderTotal}
                orderStatus={order.OrderStatus}
                shippingAddress={order.ShippingAddress}
                orderSubtotal={order.ItemsTotal}
                orderCharge={order.ShippingCharge}
            />
        )
    })


    return (
        <div className="customer-orders">
            <div className="customer-orders-label">
                {orderCards.length === 0 ? "You have not made any orders!" : "Order History"}
            </div>

            <div className="customer-order-cards-container">
                {orderCards}
            </div>
        </div>
    )
}