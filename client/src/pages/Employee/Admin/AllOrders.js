import { useEffect, useState } from "react"
import Axios from "axios";
import OrderCard from "../../../components/OrderCard"


/**
 * Creates a list with all the order cards for the administrators page that fall withing the search criteria.
 * 
 * @returns A list of order card components for the administrators page
 */
export default function AllOrders() {

    const [ordersData, setOrdersData] = useState([])                //< Holds a list of all the orders
    const [searchByStartDate, setSearchByStartDate] = useState()    //< Holds the start date for the search
    const [searchByEndDate, setSearchByEndDate] = useState()        //< Holds the end date for the search
    const [searchByStatus, setSearchByStatus] = useState("all")     //< Holds the order status for the search
    const [searchByStartPrice, setSearchByStartPrice] = useState(0) //< Holds the start price for the search
    const [searchByEndPrice, setSearchByEndPrice] = useState(99999) //< Holds the end price for the search


    useEffect(() => {
        // Requests all the orders in the database
        Axios.get("http://localhost:8800/api/retrieveOrders?orderStatus=all").then((res) => {
            setOrdersData(res.data)
        })
    },[])


    const startDate = (event) => {
        setSearchByStartDate(event.target.value)
    }

    const endDate = (event) => {
        setSearchByEndDate(event.target.value)
    }

    const orderStatus = (event) => {
        setSearchByStatus(event.target.value)
    }

    const fromPrice = (event) => {
        setSearchByStartPrice(event.target.value)
    }

    const toPrice = (event) => {
        setSearchByEndPrice(event.target.value)
    }

    // Creates a list with order cards for all the orders filtered by the current search criteria
    const orderCards = ordersData.filter((searchResult) => {
        
        // Sets the state date with a time of 00:00:00 AM
        let fromDate = new Date(searchByStartDate)
        fromDate.setDate(fromDate.getDate() + 1)
        fromDate.setHours(0)
        fromDate.setMinutes(0)
        fromDate.setSeconds(0)
        

        // Sets the end date with a time of 11:59:59 PM
        const toDate = new Date(searchByEndDate)
        toDate.setDate(toDate.getDate() + 1)
        toDate.setHours(11)
        toDate.setMinutes(59)
        toDate.setSeconds(59)


        // Handles the order status checking for the search criteria
        function checkStatus () {
            if (searchResult.OrderStatus === searchByStatus) {
                // Returns the orders with the order status that matches the specified

                return checkPrice()

            } else if (searchByStatus === "all") {
                // Otherwise all the orders are returned
                
                return checkPrice()
            } 
        }
        

        // Handles the checking of order totals for the search criteria
        function checkPrice () {
            
            if (parseFloat(searchResult.OrderTotal) >= searchByStartPrice && parseFloat(searchResult.OrderTotal) <= searchByEndPrice){
                // Returns the orders with a total price that falls withing the starting and ending price

                return searchResult  
            }
        }


        if (searchByStartDate === undefined && searchByEndDate === undefined){
            // Retruns all the orders no matter of the dates

            return checkStatus()

        } else if (searchByEndDate === undefined && searchResult.TimeStamp >= fromDate.getTime()) {
            // Returns all the orders that fall withing the start date, no matter of the end date

            return checkStatus()

        } else if (searchResult.TimeStamp >= fromDate.getTime() && searchResult.TimeStamp <= toDate.getTime()) {
            // Returns the orders that fall withing the given date range

            return checkStatus()
        }

        return null

    }).map(order => {


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
        <div className="admin-orders">
            <div className="admin-orders-label">
                <span className="bold">Administration:</span> Orders
            </div>

            <div className="order-card">

                <div className="search-by-date">
                    <span className="bold">From <input type="date" onChange={startDate} className="search-by-start-date"/> <span className="search-orders-to">to</span> <input type="date" onChange={endDate} className="search-by-end-date"/></span>
                </div>

                <div className="search-by-status">
                    <span className="bold">
                    Order Status: <select onChange={orderStatus} className="search-by-status-select">
                                    <option value="all" >All</option>
                                    <option value="authorized" >Awaiting Fullfillment</option>
                                    <option value="shipped" >Shipped</option>
                                </select>
                    </span>
                </div>

                <div className="search-by-price">
                    <span className="bold">Price from </span> $ <input type="number" min={0} onChange={fromPrice} value={searchByStartPrice} className="search-by-start-price"/> <span className="bold search-orders-to">to</span> $ <input type="number" onChange={toPrice} value={searchByEndPrice} className="search-by-end-price"/>
                </div>
            </div>
            <br/>

            <div className="admin-order-cards-container">
                {orderCards}
            </div>
        </div>
    )
}