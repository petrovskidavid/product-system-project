import { useLocation, useNavigate } from "react-router-dom"


/**
 * Creates a card for each order depending on the current page.
 * 
 * For the customers order history page it creates an order card with relevant information for the customer.
 * For the admin homepage it creates an order card displaying all the order infromation on the card.
 * For the workstation homepage it creates an order card displaying the relevant infromation for the employee.
 * 
 * @param props.authNum The authorization number of the transaction for the order
 * @param props.email The customers email
 * @param props.name The customers name
 * @param props.orderCharge The shipping charge for the order
 * @param props.orderID The order ID
 * @param props.orderStatus The status of the customers order
 * @param props.orderSubtotal The subtotal of the order
 * @param props.orderTotal The total of the order, including the shipping charge
 * @param props.shippingAddress The shipping address for the order
 * @param props.timeStamp The time of purchase for the order
 * @param props.totalWeight The total weight of all the products in the order
 * 
 * @returns The order card component
 */
export default function OrderCard(props) {

    const location = useLocation() //< Holds infromation about the current url
    const nav = useNavigate()      //< Holds functions to be able to navigate to different pages
    let orderCard                  //< Holds the correct order card depending on the current url


    if(location.pathname === "/emp/admin"){
        // Creates the order card for the admin home page

        orderCard = (
                <div className="order-card">
                <br/>
                <table className="order-card-table">
                    <tbody>
                        <tr>
                            <td className="order-card-table-label">
                                Order Number:
                            </td>

                            <td className="order-card-table-value">
                                {props.orderID}
                            </td>
                        </tr>

                        <tr>
                            <td className="order-card-table-label">
                                Date:
                            </td>
                            
                            <td className="order-card-table-value">
                            {((new Date(props.timeStamp)).getMonth() + 1).toString().padStart(2, '0')}/{(new Date(props.timeStamp)).getDate().toString().padStart(2, '0')}/{(new Date(props.timeStamp)).getFullYear()}
                            </td>
                        </tr>

                        <tr>
                            <td className="order-card-table-label">
                                Total:
                            </td>

                            <td className="order-card-table-value">
                                ${props.orderTotal}
                            </td>
                        </tr>
                        
                        <tr>
                            <td className="order-card-table-label">
                                Status:
                            </td>

                            <td className="order-card-table-value">
                                {props.orderStatus === "authorized" ? <span className="order-not-shipped">Awaiting Fulfillment</span> : (<span className="order-shipped">Shipped</span>)}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="orders-button" onClick={() => {nav("/emp/admin/order-details", {state: props})}}>Order Details</button>

            </div>
        )
    
    } else if (location.pathname === "/orders") {
        // Creates the order card for the customer orders history page

        orderCard = (
                <div className="order-card">
                <br/>
                <table className="order-card-table">
                    <tbody>
                        <tr>
                            <td className="order-card-table-label">
                                Order Number:
                            </td>

                            <td className="order-card-table-value">
                                {props.orderID}
                            </td>
                        </tr>

                        <tr>
                            <td className="order-card-table-label">
                                Authorzation Number:
                            </td>

                            <td className="order-card-table-value">
                                {props.authNum}
                            </td>
                        </tr>

                        <tr>
                            <td className="order-card-table-label">
                                Date:
                            </td>
                            
                            <td className="order-card-table-value">
                                {((new Date(props.timeStamp)).getMonth() + 1).toString().padStart(2, '0')}/{(new Date(props.timeStamp)).getDate().toString().padStart(2, '0')}/{(new Date(props.timeStamp)).getFullYear()}
                            </td>
                        </tr>

                        <tr>
                            <td className="order-card-table-label">
                                Total:
                            </td>

                            <td className="order-card-table-value">
                                ${props.orderTotal}
                            </td>
                        </tr>
                        
                        <tr>
                            <td className="order-card-table-label">
                                Status:
                            </td>

                            <td className="order-card-table-value">
                                {props.orderStatus === "authorized" ? <span className="order-not-shipped">Awaiting Fulfillment</span> : (<span className="order-shipped">Shipped</span>)}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="orders-button" onClick={() => {nav("/orders/details",{state: props})}}>Order Details</button>
                
            </div>
        )

    } else if(location.pathname === "/emp/workstations"){
        // Creates the order card for the workstation employees page

        orderCard = (
                <div className="order-card">
                <br/>
                <table className="order-card-table">
                    <tbody>
                        <tr>
                            <td className="order-card-table-label">
                                Order Number:
                            </td>

                            <td className="order-card-table-value">
                                {props.orderID}
                            </td>
                        </tr>

                        <tr>
                            <td className="order-card-table-label">
                                Total Weight:
                            </td>

                            <td className="order-card-table-value">
                                {props.totalWeight} lbs
                            </td>
                        </tr>

                        <tr>
                            <td className="order-card-table-label">
                                Total:
                            </td>

                            <td className="order-card-table-value">
                                ${props.orderTotal}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button className="orders-button" onClick={() => {nav("/emp/workstations/order-details", {state: props})}}>Order Details</button>

            </div>
        )
    }


    return (
        orderCard
    )
}