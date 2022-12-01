import { useEffect, useState } from "react"
import Axios from "axios";
import OrderCard from "../../../components/OrderCard"

export default function AllOrders() {

    const [ordersData, setOrdersData] = useState([])
    const [searchByStartDate, setSearchByStartDate] = useState()
    const [searchByEndDate, setSearchByEndDate] = useState()
    const [searchByStatus, setSearchByStatus] = useState("all")
    const [searchByStartPrice, setSearchByStartPrice] = useState(0)
    const [searchByEndPrice, setSearchByEndPrice] = useState(99999)

    useEffect(() => {

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


    const orderCards = ordersData.filter((searchResult) => {
        
        let fromDate = new Date(searchByStartDate)
        fromDate.setDate(fromDate.getDate() + 1)
        fromDate.setHours(0)
        fromDate.setMinutes(0)
        fromDate.setSeconds(0)
        

        const toDate = new Date(searchByEndDate)
        toDate.setDate(toDate.getDate() + 1)
        toDate.setHours(11)
        toDate.setMinutes(59)
        toDate.setSeconds(59)


        function checkStatus () {
            if (searchResult.OrderStatus === searchByStatus) {



                return checkPrice()
                
            
            } else if (searchByStatus === "all") {
                
                return checkPrice()
            } 
        }
        

        function checkPrice () {
            
            if (parseFloat(searchResult.OrderTotal) >= searchByStartPrice && parseFloat(searchResult.OrderTotal) <= searchByEndPrice){

                return searchResult  
            }
        }

        if (searchByStartDate === undefined && searchByEndDate === undefined){
            
            return checkStatus()

        } else if (searchByEndDate === undefined && searchResult.TimeStamp >= fromDate.getTime()) {

            return checkStatus()

        } else if (searchResult.TimeStamp >= fromDate.getTime() && searchResult.TimeStamp <= toDate.getTime()) {

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