import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { ToastContainer } from "react-toastify";

import ReactPlaceholder from "react-placeholder";

import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../features/apiCall";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "../utils/axios";
import {
  shippingDetailsFailure,
  shippingDetailsStart,
  shippingDetailsSuccess,
} from "../features/shippingDetailsSlice";
import AlertBox from "./layout/AlertBox";
import { FaHandPointRight } from "react-icons/fa";

const formatText = (text) => {
  // Format text starting with a dollar sign ($) as bold
  const formattedText = text.replace(/\$(\d+)/g, "<strong>$&</strong> ");
  // Format "Note:-" as bold
  const finalText = formattedText.replace(
    /Note:-/g,
    "<strong><br /><br />Note:-</strong>"
  );

  // console.log({ finalText });
  return finalText;
};

const Cart = () => {
  const { isFetching, cartItems, cartTotalAmount } = useSelector((state) => state.cart);
  const { loading, shippingDetails, error } = useSelector((state) => state.shippingDetails);

  const { token } = useSelector((state) => state.auth);
  const [cart, setCart] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const fetchShippingDetails = async () => {
  //   dispatch(shippingDetailsStart());
  //   try {
  //     const { data } = await axios.get("/api/shipping/all", {
  //       headers: {
  //         Authorization: `${token}`,
  //       },
  //     });

  //     dispatch(shippingDetailsSuccess(data?.shippings));

  //     data?.shippings?.map((ship) => formatText(ship));
  //   } catch (error) {
  //     dispatch(shippingDetailsFailure(error?.response?.data?.error?.message));
  //   }
  // };

  useEffect(() => {
    getCart(dispatch);
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (cartItems) {
      setCart(cartItems);
    }

    // fetchShippingDetails();
  }, [cartItems]);

  return (
    <>
      <ReactBreadcrumb path={`Home / Shopping Cart`} />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container style={{ paddingTop: "3rem" }}>
          <div className="cart-items-len">
            <h3>Shopping Cart</h3>

            <div className="cart-alert-box">
              <AlertBox
                type={"dark"}
                desc={
                  cartItems?.length === 1 ? (
                    <p>
                      <AiOutlineInfoCircle style={{ marginRight: "0.5rem" }} />
                      You have <b>{cartItems?.length}</b> item in your cart
                    </p>
                  ) : (
                    <p>
                      <AiOutlineInfoCircle style={{ marginRight: "0.5rem" }} />
                      You have <b>{cartItems?.length}</b> items in your cart
                    </p>
                  )
                }
                cart={true}
                onHome={true}
              />
            </div>
          </div>

          <Row className="product-content justify-content-center">
            <Col md={9} lg={7} className="px-md-5">
              {!isFetching && cart?.length === 0 ? (
                <div className="cart-alert-box">
                  <AlertBox
                    heading={"Your cart is currently empty!"}
                    type={"dark"}
                    desc={
                      <>
                        <hr />
                        <p className="mt-4 mb-4">
                          Before you proceed to checkout you must add some
                          products to your shopping cart.
                        </p>
                        <hr />
                      </>
                    }
                    cart={true}
                  />
                </div>
              ) : (
                cart?.map((i) => (
                  <CartItem key={Math.random()} cartItem={i} />
                ))
              )}

              {cartItems.length > 0 ? (
                <Button
                  className="proceed-btn btn-dark"
                  onClick={() => navigate("/home/checkout-address")}
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <Button
                  className="proceed-btn diasbled-proceed btn-dark"
                  disabled
                >
                  Proceed to Checkout
                </Button>
              )}
            </Col>
          </Row>

        </Container>
      </motion.div>
      <ToastContainer />
    </>
  );
};

export default Cart;
