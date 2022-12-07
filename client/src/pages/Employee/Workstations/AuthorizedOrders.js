import { useEffect, useState } from "react"
import Axios from "axios";
import OrderCard from "../../../components/OrderCard"


/**
 * Creates a list with order cards for all the orders that have not been shipped for the workstations page.
 * 
 * @returns A list of order card components for the workstation page
 */
export default function AuthorizedOrders() {

    const [ordersData, setOrdersData] = useState([]) //< Holds a list of all the unfullfiled orders

    useEffect(() => {
        // Request all the orders that have been authorized but not shipped
        Axios.get("http://localhost:8800/api/retrieveOrders?orderStatus=authorized").then((res) => {
            setOrdersData(res.data)
        })
    },[])


    // Creates a order card for each unfullfiled order and stores it in the list
    const orderCards = ordersData.map(order => {


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
                <span className="bold">Workstations:</span> Orders
            </div>

            <div className="warehouse-order-cards-container">
                {orderCards}
            </div>
        </div>
    )
}