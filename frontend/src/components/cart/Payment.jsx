import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import toast from "react-hot-toast";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import CheckOutSteps from "./checkOutSteps";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createOrder, clearError } from "../../slices/orderSlice";

const options = {
  style: {
    base: {
      fontsize: "16px",
    },
    invalid: {
      color: "#b11010ff",
    },
  },
};
const Payment = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.order);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, toast, error]);
  const order = {
    orderItems: cartItems,
    shippingInfo,
  };
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }
  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay-btn").disabled = true;
    let res;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      res = await axios.post("/api/v1/payment/process", paymentData, config);
      const clientSecret = res.data.client_secret;
      if (!stripe || !elements) {
        return;
      }
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });
      if (result.error) {
        toast.error(result.error.message);
        document.querySelector("#pay-btn").disabled = false;
      } else {
        if (result.paymentIntent.status === "succeeded") {
          toast.success("success");
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(createOrder(order));
          navigate("/success");
        } else {
          toast.error("There is some issue while payment proccessing.");
        }
      }
    } catch (error) {
      document.querySelector("#pay-btn").disabled = false;
      toast.error(error.response.data.message);
    }
  };
  return (
    <Fragment>
      <MetaData title={"payment"} />
      <CheckOutSteps shipping confirmOrder payment></CheckOutSteps>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="form-control"
                options={options}
              />
            </div>

            <button id="pay-btn" type="submit" className="btn btn-block py-3">
              Pay {` - ${orderInfo && orderInfo.totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
