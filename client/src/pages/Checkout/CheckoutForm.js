import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Axios from "axios"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import valid from "card-validator"
import { toast } from "react-custom-alert"
import "../../assets/css/CheckoutPage.css"


// Holds validation rules for the sign up form inputs
const checkoutValidation = yup.object().shape({
    firstName: yup.string().max(255).required("Please provide your first name"),
    lastName: yup.string().max(255).required("Please provide your last name"),
    address: yup.string().max(255).required("Please provide the shipping address"),
    city: yup.string().max(255).required("Please provide the city of the address"),
    state: yup.string().test("test-state", "Please choose the state of the address", (value) => value !== ""),
    zipCode: yup.string().required("Please provide the ZIP code of the address").matches(/^[0-9]+$/, "Must be only digits").length(5),
    ccNum: yup.string().required("Please provide your Credit Card number").test("test-ccNum", "Please provide a valid Credit Card number", value => valid.number(value).isValid),
    expMonth: yup.string().required("Please provide your Credit Cards expiration month").length(2).test("test-expMonth", "Please provide a valid month", value => valid.expirationMonth(value).isValid),
    expYear: yup.string().required("Please provide your Credit Cards expiration year").length(4).test("test-expYear", "Please provide a valid year", value => valid.expirationYear(value).isValid),
    cvv: yup.string().required("Please provide your Credit Cards CVV").length(3).test("test-cvv", "Invalid CVV", value => valid.cvv(value).isValid)
})


export default function CheckoutForm() {

    const nav = useNavigate() //< Used to redirect client
    const [weightBrackets, setWeightBrackets] = useState([]) //< Holds the list of all the products
    const [cartItemsData, setCartItemsData] = useState([]) //< Holds the list of all the products
    const [productsData, setProductsData] = useState([]) //< Holds the list of all the products
    const [retrievedWeightBrackets, setRetrievedWeightBrackets] = useState(false)
    const [retrievedProducts, setRetrievedProducts] = useState(false)
    const [retrievedCartItems, setRetrievedCartItems] = useState(false)
    let orderTotalBefore = 0
    let orderTotalWeight = 0
    let orderShippingCharge = 0
    let orderTotal = 0
    let orderAuthorizationNum
    let orderTimeStamp
    let orderPurchasedProducts = []
    let bottomThreeErrMessage
    let shippingAddress

    // Uses the above validation rules to handle the forms input and provides parameters to use
    const { register, setValue, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(checkoutValidation)
    })

    // Only calls once per render of the component
    useEffect(() => {

        // Requests a list of all the products in the database
        Axios.get("http://localhost:8800/api/getCart?email=" + localStorage.getItem("customerEmail")).then((res) => {
            setCartItemsData(res.data)
            setRetrievedCartItems(true)
        })

        Axios.get("http://localhost:8800/api/getWeightBrackets").then((res) => {
            setWeightBrackets(res.data)
            setRetrievedWeightBrackets(true)
        })

        // Requests a list of all the products in the database
        Axios.get("http://localhost:8800/api/getProducts").then((res) => {
            setProductsData(res.data)
            setRetrievedProducts(true)
        })

    }, [nav, retrievedCartItems])

    
    if (retrievedCartItems && retrievedWeightBrackets && retrievedProducts){
        cartItemsData.map((cartItem) => {

            let productInCart = productsData.find(product => cartItem.ProductID === product.number)
            orderTotalWeight += (productInCart.weight * cartItem.Quantity)
            orderTotalBefore += (productInCart.price * cartItem.Quantity)

            orderPurchasedProducts.push({"ProductID": cartItem.ProductID, "Quantity": cartItem.Quantity})

            return null
        })

        for(let i = 0; i < weightBrackets.length; i++){

            if (i === weightBrackets.length - 1){
                if(orderTotalWeight >= weightBrackets[i].StartRange)
                    orderShippingCharge = weightBrackets[i].Charge
            
            }else if(orderTotalWeight >= weightBrackets[i].StartRange && orderTotalWeight < weightBrackets[i + 1].StartRange){
                orderShippingCharge = weightBrackets[i].Charge

            }
        }

        orderTotal = orderTotalBefore + orderShippingCharge
    }

    const submitPurchase = (data) => {

        Axios.post("http://blitz.cs.niu.edu/creditcard", {
            vendor: "Muffler Man",
            trans: cartItemsData[0].OrderID.toUpperCase(),
            cc: data.ccNum,
            name: data.firstName + " " + data.lastName,
            exp: data.expMonth + "/" + data.expYear,
            amount: orderTotal

        }).then(response => {

            if(response.data.errors){
                toast.error("There was an error processing your transaction. Please check your payment infromation. (Error: " + response.data.errors[0] + ")")
            
            } else {

                orderAuthorizationNum = response.data.authorization
                orderTimeStamp = response.data.timeStamp
                shippingAddress = data.address + ", " + data.city + ", " + data.state + " " + data.zipCode

                Axios.post("http://localhost:8800/api/updateOrder", {
                    name: localStorage.getItem("customerName"),
                    orderID: cartItemsData[0].OrderID,
                    orderStatus: "authorized",
                    itemsTotal: orderTotalBefore.toFixed(2),
                    totalWeight: orderTotalWeight.toFixed(2),
                    shipping: orderShippingCharge,
                    shippingAddress: shippingAddress,
                    orderTotal: orderTotal.toFixed(2),
                    authorizationNumber: orderAuthorizationNum,
                    timeStamp: orderTimeStamp,
                    productsPurchased: orderPurchasedProducts

                }).then(() => {
                    // Change later
                    nav("/orders?auth=" + orderAuthorizationNum)
                })
            }
            
        }) 
    }


    if(errors.expMonth?.type === "length" || errors.expYear?.type === "length" || errors.cvv?.type === "length"){
        bottomThreeErrMessage = "Please provide the correct number of digits"

    } else if(errors.expMonth?.type === "test-expMonth" || errors.expYear?.type === "test-expYear" || errors.cvv?.type === "test-cvv") {
        bottomThreeErrMessage = "One of the three fields above is invalid"

    } else if(errors.expMonth?.type === "required" || errors.expYear?.type === "required" || errors.cvv?.type === "required"){
        bottomThreeErrMessage = "Please complete the three fields above"
    }
    
    
    return (
        <div className="checkout">
            <div className="checkout-container">
                <div className="checkout-form">
                    <form method="POST" onSubmit={handleSubmit(submitPurchase)} noValidate>
                        <div className="form-title">
                            Checkout
                        </div>

                        <input
                            className="checkout-first-name"
                            {...register('firstName')}
                            placeholder="First Name"
                            type="text"
                        />
                        <div className="form-error">
                            {errors.firstName?.type === "max" ? "Exceeds character limit of 255" : errors.firstName?.message}
                        </div>

                        <input 
                            className="checkout-last-name"
                            {...register('lastName')}
                            placeholder="Last Name"
                            type="text"
                        />
                        <div className="form-error">
                            {errors.lastName?.type === "max" ? "Exceeds character limit of 255" : errors.lastName?.message}
                        </div>

                        <input 
                            className="checkout-address"
                            {...register('address')}
                            placeholder="Address"
                            type="text"
                        />
                        <div className="form-error">
                        {errors.address?.type === "max" ? "Exceeds character limit of 255" : errors.address?.message}
                        </div>

                        <input 
                            className="checkout-city"
                            {...register('city')}
                            placeholder="City"
                            type="text"
                        />
                        <div className="form-error">
                            {errors.city?.type === "max" ? "Exceeds character limit of 255" : errors.city?.message}
                        </div>

                        <div>
                            <select {...register('state')} className="checkout-state" required >
                                <option value="">State</option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="DC">District Of Columbia</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                            </select>
                        </div>
                        <div className="form-error">
                            {errors.state?.message}
                        </div>

                        <input 
                            className="checkout-zip"
                            {...register('zipCode')}
                            placeholder="ZIP Code"
                            type="text"
                            maxLength="5"
                        />  
                        <div className="form-error">
                            {errors.zipCode?.type === "typeError" ? "Please provide the ZIP Code of the address" : errors.zipCode?.message}
                        </div>

                        <input 
                            className="checkout-ccNum"
                            {...register(
                                'ccNum', 
                                {
                                    onChange: (e) => setValue("ccNum", e.target.value.replace(/[^0-9]/gi, '').replace(/(.{4})/g, '$1 ').trim())
                                })}
                            placeholder="0000 0000 0000 0000"
                            type="text"
                            maxLength={19}
                        />
                        <div className="form-error">
                            {errors.ccNum?.message}
                        </div>

                        <input 
                            className="checkout-expMonth"
                            {...register('expMonth')}
                            placeholder="MM"
                            type="text"
                            maxLength="2"
                        />
                        <input 
                            className="checkout-expYear"
                            {...register('expYear')}
                            placeholder="YYYY"
                            type="text"
                            maxLength="4"
                        />
                         <input 
                            className="checkout-cvv"
                            {...register('cvv')}
                            placeholder="CVV"
                            type="text"
                            maxLength="3"
                        />
                        <div className="form-error">
                            {bottomThreeErrMessage}
                        </div>
                        {orderTotal !== 0 && <input type="submit" value="Confirm Purchase" className="checkout-form-btn"/>}
                        <br/>
                        <br/>
                    </form>
                </div>
                <div className="order-summary">
                    <div className="order-summary-title"><span className="bold">Order Summary</span></div>
                    <table className="order-summary-table">
                        <tbody>
                            <tr>
                                <td className="order-summary-table-label">
                                    Subtotal:
                                </td>
                                <td className="order-summary-table-value">
                                    ${orderTotalBefore.toFixed(2)}
                                </td>
                            </tr>
                            <tr>
                                <td className="order-summary-table-label">
                                    Weight:
                                </td>
                                <td className="order-summary-table-value">
                                    {orderTotalWeight.toFixed(2)} lbs
                                </td>
                            </tr>
                            <tr>
                                <td className="order-summary-table-label">
                                    Shipping:
                                </td>
                                <td className="order-summary-table-value">
                                    ${orderShippingCharge}
                                </td>
                            </tr>
                            <tr>
                                <td className="order-summary-table-label">
                                    Order Total:
                                </td>
                                <td className="order-summary-table-value">
                                ${orderTotal.toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}