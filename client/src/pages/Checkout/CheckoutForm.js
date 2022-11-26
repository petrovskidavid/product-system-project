import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Axios from "axios"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import valid from "card-validator"


// Holds validation rules for the sign up form inputs
const checkoutValidation = yup.object().shape({
    firstName: yup.string().max(255).required("Please provide your first name"),
    lastName: yup.string().max(255).required("Please provide your last name"),
    address: yup.string().max(255).required("Please provide the shipping address"),
    city: yup.string().max(255).required("Please provide the city of the address"),
    state: yup.string().test("test-state", "Please choose the state of the address", (value) => value !== ""),
    zipCode: yup.string().required("Please provide the ZIP code of the address").matches(/^[0-9]+$/, "Must be only digits").length(5),
    ccNum: yup.string().required("Please provide your Credit Card number").test("test-ccNum", "Invalid Credit Card number", value => valid.number(value).isValid),
    expDate: yup.string().required("Please provide your Credit Cards expiradtion date").test("test-expDate", "Invalid expiration date", value => valid.expirationDate(value).isValid),
    cvv: yup.string().required("Please provide your Credit Cards CVV").test("test-cvvv", "Invalid CVV", value => valid.cvv(value).isValid)
})


export default function CheckoutForm() {

    const nav = useNavigate() //< Used to redirect client


    // Uses the above validation rules to handle the forms input and provides parameters to use
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(checkoutValidation)
    })


    const submitPurchase = (data) => {
       
        console.log(data)
    }

    console.log(errors)
    
    return (
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
                    {...register('ccNum')}
                    placeholder="0000 0000 0000 0000"
                    type="text"
                />
                <div className="form-error">
                    {errors.ccNum?.message}
                </div>

                <input 
                    className="checkout-expDate"
                    {...register('expDate')}
                    placeholder="MM/YY"
                    type="text"
                    maxLength="5"
                />
                <div className="form-error">
                    {errors.expDate?.message}
                </div>

                <input 
                    className="checkout-cvv"
                    {...register('cvv')}
                    placeholder="CVV"
                    type="text"
                    maxLength="3"
                />
                <div className="form-error">
                {errors.cvv?.message}
                </div>

                <input type="submit" value="Confirm Purchase" className="checkout-form-btn"/>
                <br/>
                <br/>
            </form>
        </div>
    )
}