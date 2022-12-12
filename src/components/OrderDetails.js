import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ReactToPrint from "react-to-print"
import Axios from "axios"
import { toast } from "react-custom-alert"
import "../assets/css/OrderDetails.css"

/**
 * Displays the order details for the order depending on the current page.
 * 
 * It displays the relevant infromation for the customer, administrator employees and workstations employees.
 * 
 * @returns The order details component
 */
export default function OrderDetails() {

    const [productsInOrder, setProductsInOrder] = useState([]) //< Holds the list of products in the order
    const nav = useNavigate()                                  //< Holds functions to be able to navigate to different pages
    const location = useLocation()                             //< Holds infromation about the current url
    const orderInfo = location.state                           //< Holds the GET parameters if any in the current url
    let listOfProducts                                         //< Holds a list of table rows for each product
    let orderDetails                                           //< Holds the order details component depending on the current url
    const packingListRef = useRef()                            //< References the packing list from the workstation order details component
    const invoiceRef = useRef()                                //< References the invoice from the workstation order details component
    const shippingLabelRef = useRef()                          //< References the shipping label from the workstation order details component


    useEffect(() => {

        // Gets all the products in the current order
        Axios.get(process.env.REACT_APP_API_URL + "/api/retrieveProductsInOrder?orderID=" + orderInfo.orderID).then((res) => {
            setProductsInOrder(res.data)
        })
    },[orderInfo.orderID])


    if(location.pathname === "/orders/details"){
        // Creates the order details component for the customers order details

        listOfProducts = productsInOrder.map(product => {
            return (
                <tr key={product.ProductID}>
                    <td >{product.ProductDesc}</td>
                    <td>{product.Quantity}</td>
                    <td>{product.ProductWeight.toFixed(2)} lbs</td>
                    <td>${product.Price}</td>
                </tr>
            )
        })

        orderDetails = (
            <div className="order-details">
                <div className="order-details-title">Order #{orderInfo.orderID} Details</div>
                <div className="order-details-container">
                    <table className="order-details-table">
                        <tbody>
                            <tr>
                                <td className="order-details-table-label">
                                    Order Status:
                                </td>

                                <td className="order-details-table-value">
                                    {orderInfo.orderStatus === "authorized" ? <span className="order-not-shipped">Awaiting Fulfillment</span> : (<span className="order-shipped">Shipped</span>)}
                                </td>
                            </tr>

                            <tr>
                                <td className="order-details-table-label">
                                    Authorization Number:
                                </td>

                                <td className="order-details-table-value">
                                    {orderInfo.authNum}
                                </td>
                            </tr>

                            <tr>
                                <td className="order-details-table-label">
                                    Ordered On:
                                </td>

                                <td className="order-details-table-value">
                                    {((new Date(orderInfo.timeStamp)).getMonth() + 1).toString().padStart(2, '0')}/{(new Date(orderInfo.timeStamp)).getDate().toString().padStart(2, '0')}/{(new Date(orderInfo.timeStamp)).getFullYear()} {(new Date(orderInfo.timeStamp)).getHours().toString().padStart(2, '0')}:{(new Date(orderInfo.timeStamp)).getMinutes().toString().padStart(2, '0')}:{(new Date(orderInfo.timeStamp)).getSeconds().toString().padStart(2, '0')}                                
                                </td>
                            </tr>

                            <tr>
                                <td className="order-details-table-label">
                                    Shipping Address:
                                </td>

                                <td className="order-details-table-value">
                                    {orderInfo.shippingAddress}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr/>
                    <table className="order-details-table">
                        <tbody>
                            <tr>
                                <th colSpan={4}>Ordered Items</th>
                                
                            </tr>
                            <tr>
                                <th>
                                    Description
                                </th>
                                <th>
                                    Quantity
                                </th>
                                <th>
                                    Weight
                                </th>
                                <th>
                                    Price
                                </th>
                            </tr>

                            {listOfProducts}

                            <tr><td><br/></td></tr>

                            <tr>
                                <td></td>
                                <td>
                                    <span className="bold">Total:</span>
                                </td>

                                <td>
                                    {orderInfo.totalWeight} lbs
                                </td>

                                <td>
                                    ${orderInfo.orderSubtotal}
                                </td>
                            </tr>
                            

                            <tr><td><br/></td></tr>

                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <span className="bold">Shipping Charge:</span>
                                </td>
                                <td>
                                    ${orderInfo.orderCharge}
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <span className="bold">Order Total:</span>
                                </td>
                                <td>
                                    ${orderInfo.orderTotal}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <button className="order-details-button" onClick={() => {nav("/orders")}}>Close Details</button>
                </div>
            </div>
        )

    } else if(location.pathname === "/emp/admin/order-details"){
        // Creates the order details component for the administrator employees

        listOfProducts = productsInOrder.map(product => {
            return (
                <tr key={product.ProductID}>
                    <td >{product.ProductDesc}</td>
                    <td>{product.Quantity}</td>
                    <td>{product.ProductWeight.toFixed(2)} lbs</td>
                    <td>${product.Price}</td>
                </tr>
            )
        })

        orderDetails = (
            <div className="order-details">
                <div className="order-details-title">Order #{orderInfo.orderID} Details</div>
                <div className="order-details-container">
                    <table className="order-details-table">
                        <tbody>
                            <tr>
                                <td className="order-details-table-label">
                                    Order Status:
                                </td>

                                <td className="order-details-table-value">
                                    {orderInfo.orderStatus === "authorized" ? <span className="order-not-shipped">Awaiting Fulfillment</span> : (<span className="order-shipped">Shipped</span>)}
                                </td>
                            </tr>

                            <tr>
                                <td className="order-details-table-label">
                                    Authorization Number:
                                </td>

                                <td className="order-details-table-value">
                                    {orderInfo.authNum}
                                </td>
                            </tr>

                            <tr>
                                <td className="order-details-table-label">
                                    Customer Name:
                                </td>

                                <td className="order-details-table-value">
                                    {orderInfo.name}
                                </td>
                            </tr>

                            <tr>
                                <td className="order-details-table-label">
                                    Customer Email:
                                </td>

                                <td className="order-details-table-value">
                                    {orderInfo.email}
                                </td>
                            </tr>

                            <tr>
                                <td className="order-details-table-label">
                                    Ordered On:
                                </td>

                                <td className="order-details-table-value">
                                {((new Date(orderInfo.timeStamp)).getMonth() + 1).toString().padStart(2, '0')}/{(new Date(orderInfo.timeStamp)).getDate().toString().padStart(2, '0')}/{(new Date(orderInfo.timeStamp)).getFullYear()} {(new Date(orderInfo.timeStamp)).getHours().toString().padStart(2, '0')}:{(new Date(orderInfo.timeStamp)).getMinutes().toString().padStart(2, '0')}:{(new Date(orderInfo.timeStamp)).getSeconds().toString().padStart(2, '0')}
                                </td>
                            </tr>

                            <tr>
                                <td className="order-details-table-label">
                                    Shipping Address:
                                </td>

                                <td className="order-details-table-value">
                                    {orderInfo.shippingAddress}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr/>
                    <table className="order-details-table">
                        <tbody>
                            <tr>
                                <th colSpan={4}>Ordered Items</th>
                                
                            </tr>
                            <tr>
                                <th>
                                    Description
                                </th>
                                <th>
                                    Quantity
                                </th>
                                <th>
                                    Weight
                                </th>
                                <th>
                                    Price
                                </th>
                            </tr>

                            {listOfProducts}

                            <tr><td><br/></td></tr>

                            <tr>
                                <td></td>
                                <td>
                                    <span className="bold">Total:</span>
                                </td>

                                <td>
                                    {orderInfo.totalWeight} lbs
                                </td>

                                <td>
                                    ${orderInfo.orderSubtotal}
                                </td>
                            </tr>
                            

                            <tr><td><br/></td></tr>

                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <span className="bold">Shipping Charge:</span>
                                </td>
                                <td>
                                    ${orderInfo.orderCharge}
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <span className="bold">Order Total:</span>
                                </td>
                                <td>
                                    ${orderInfo.orderTotal}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <button className="order-details-button" onClick={() => {nav("/emp/admin")}}>Close Details</button>
                </div>
            </div>
        )

    } else if("/emp/workstations/order-details"){
        // Creates the order details component for the workstation employees

        // Updates the order status to shipped once the employee fulfills the order
        const shipOrder = () => {
            
            Axios.post(process.env.REACT_APP_API_URL + "/api/shipOrder", {
                orderID: orderInfo.orderID

            }).then(res => {

                if(res.data.shipped){
                    // Shipping was successfull and the employee is redirected to the homepage
                    nav("/emp/workstations?shippedOrder=" + orderInfo.orderID)

                } else {
                    // There was an error with shipping
                    toast.error("Failed to update order status. Try again!")
                }
            })

        }

        let packingList = productsInOrder.map(product => {
            return (
                <tr key={product.ProductID}>
                    <td>{product.ProductID}</td>
                    <td>{product.ProductDesc}</td>
                    <td>{product.Quantity}</td>
                </tr>
            )
        })

        listOfProducts = productsInOrder.map(product => {
            return (
                <tr key={product.ProductID}>
                    <td >{product.ProductDesc}</td>
                    <td>{product.Quantity}</td>
                    <td>{product.ProductWeight.toFixed(2)} lbs</td>
                    <td>${product.Price}</td>
                </tr>
            )
        })

        orderDetails = (
            <div className="order-details">
                <div className="order-details-title">Order #{orderInfo.orderID} Details</div>

                
                <div className="order-details-container" ref={packingListRef}>
                        <div className="packing-list-title">Packing List</div>

                        <table className="packing-list-table">
                            <tbody>
                                <tr>
                                    <th>
                                        ID
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th>
                                        Quantity
                                    </th>
                                </tr>

                                {packingList}
                            </tbody>
                        </table>
                </div>
                <br/>
                <ReactToPrint
                        trigger={() => <button className="print-button">Print Packing List</button>}
                        content={() => packingListRef.current}
                />
                

                <br/>
                <br/>
                
                <div className="order-details-container" ref={invoiceRef}>
                    <div className="invoice-title">Invoice</div>

                    <table className="invoice-table">
                        <tbody>
                            <tr>
                                <th>
                                    Description
                                </th>
                                <th>
                                    Quantity
                                </th>
                                <th>
                                    Weight
                                </th>
                                <th>
                                    Price
                                </th>
                            </tr>

                            {listOfProducts}

                            <tr><td><br/></td></tr>

                            <tr>
                                <td></td>
                                <td>
                                    <span className="bold">Total:</span>
                                </td>

                                <td>
                                    {orderInfo.totalWeight} lbs
                                </td>

                                <td>
                                    ${orderInfo.orderSubtotal}
                                </td>
                            </tr>
                            

                            <tr><td><br/></td></tr>

                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <span className="bold">Shipping Charge:</span>
                                </td>
                                <td>
                                    ${orderInfo.orderCharge}
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <span className="bold">Order Total:</span>
                                </td>
                                <td>
                                    ${orderInfo.orderTotal}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br/>
                <ReactToPrint
                            trigger={() => <button className="print-button">Print Invoice</button>}
                            content={() => invoiceRef.current}
                />

                <br/>
                <br/>

                <div className="order-details-container" ref={shippingLabelRef}>
                    <div className="shipping-label-title">Shipping Label</div>

                    <div className="shipping-label-name">{orderInfo.name}</div>
                    <div className="shipping-label-address">{orderInfo.shippingAddress}</div>
                </div>
                <br/>
                <ReactToPrint
                            trigger={() => <button className="print-button">Print Shipping Label</button>}
                            content={() => shippingLabelRef.current}
                />
                
                <br/>
                <br/>

                <div className="order-details-container">

                    <div className="confirmation-email">
                        <div className="confirmation-email-text">
                            A confirmation email will be sent to <span className="bold">{orderInfo.email}</span> upon shipping the order.
                        </div>
                    </div>

                    <button className="order-details-button" onClick={() => {nav("/emp/workstations")}}>Close Details</button>
                    <button className="order-ship-button" onClick={shipOrder}>Ship Order</button>
                </div>
            </div>
        )
    }

    
    return(
        orderDetails
    )
}