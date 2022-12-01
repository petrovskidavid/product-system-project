import { useLocation, useNavigate } from "react-router-dom"

export default function OrderCard(props) {

    const location = useLocation()
    const nav = useNavigate()
    let orderCard

    if(location.pathname === "/emp/admin"){
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
                                {(new Date(props.timeStamp)).getDate()}/{(new Date(props.timeStamp)).getMonth() + 1}/{(new Date(props.timeStamp)).getFullYear()}
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
                                {(new Date(props.timeStamp)).getDate()}/{(new Date(props.timeStamp)).getMonth() + 1}/{(new Date(props.timeStamp)).getFullYear()}
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

    } else if(location.pathname === "/emp/warehouse"){
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
                <button className="orders-button" onClick={() => {nav("/emp/warehouse/order-details", {state: props})}}>Order Details</button>

            </div>
        )
    }


    return (
        orderCard
    )
}