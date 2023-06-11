import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import emptyCartImage from "../pictures/empty.gif";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import CartProduct from "../Components/cartProduct";

const Cart = () => {
  const productCartItem = useSelector((state) => state.product.cartItem);
  //console.log(productCartItem);
  const navigate = useNavigate();

  const userData = useSelector((state) => state.user);
  console.log(userData);

  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );

  const [detailsSaved, setDetailsSaved] = useState(false);

  const handlePayment = async () => {
    if (!detailsSaved) {
      // Check if details are saved
      toast("Please save delivering details first");
      return;
    }
    if (userData.email) {
      const stripePromise = await loadStripe(
        process.env.REACT_APP_STRIPE_PUBLIC_KEY
      );
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(productCartItem),
        }
      );
      if (res.statusCode === 500) return;

      const data = await res.json();
      console.log(data);

      toast("Redirecting to payment Gateway...!");
      stripePromise.redirectToCheckout({ sessionId: data });
    } else {
      toast("You have not Login!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: userData.email,
    contact: "",
    address: "",
  });
  console.log(data);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  console.log(setData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, contact, address } = data;
    if (email && contact && address) {
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/cart`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const val = await fetchData.json();
      console.log(val);
      toast(val.message);
      if (val.alert) {
        toast("Successfully captured Details!!");
        setDetailsSaved(true);
      } else {
        toast("Either fields are invalid");
      }
    } else {
      alert("Please Enter required fields");
    }
  };
  return (
    <>
      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-2xl font-bold text-slate-600">
          Your Cart Items
        </h2>

        {productCartItem[0] ? (
          <div className="my-3 flex gap-3">
            {/* display cart items  */}
            <div className="w-full max-w-3xl ">
              {productCartItem.map((el) => {
                return (
                  <CartProduct
                    key={el._id}
                    id={el._id}
                    name={el.name}
                    image={el.image}
                    category={el.category}
                    qty={el.qty}
                    total={el.total}
                    price={el.price}
                  />
                );
              })}
            </div>

            {/* total cart item  */}
            <div className="w-full max-w-md mx-auto">
              <form className="w-full  flex flex-col" onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                  type={"name"}
                  id="name"
                  name="name"
                  required
                  className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
                  value={userData.firstName}
                  // onChange={handleOnChange}
                />
                <label htmlFor="email">Email</label>
                <input
                  type={"email"}
                  id="email"
                  name="email"
                  required
                  className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
                  value={userData.email}
                  // onChange={handleOnChange}
                />
                <label htmlFor="contact">Contact</label>
                <input
                  type={"tel"}
                  id="contact"
                  name="contact"
                  pattern="[0-9]{10}"
                  minLength={10}
                  maxLength={10}
                  title="Enter a valid 10-digit phone number"
                  required
                  placeholder="Enter Your Contact No."
                  className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
                  value={data.contact}
                  onChange={handleOnChange}
                />
                <label htmlFor="address">Address</label>

                <textarea
                  rows={3}
                  className="bg-slate-200 p-1 my-1 resize-none"
                  name="address"
                  required
                  placeholder="Enter Delivering Address"
                  value={data.address}
                  onChange={handleOnChange}
                ></textarea>

                <button
                  type="submit"
                  className="w-full max-w-[135px] py-1 bg-blue-500 hover:bg-blue-600 cursor-pointer  text-white text-xl font-medium text-center py-1 rounded mt-4"
                >
                  Save Details
                </button>
              </form>

              <h2 className="bg-orange-500 text-white p-2 text-lg my-6 rounded">
                Summary
              </h2>
              <div className="flex w-full py-2 text-lg border-b">
                <p>Total Qty :</p>
                <p className="ml-auto w-32 font-bold">{totalQty}</p>
              </div>
              <div className="flex w-full py-2 text-lg border-b">
                <p>Total Price</p>
                <p className="ml-auto w-32 font-bold">
                  <span className="text-red-500">₹</span> {totalPrice}
                </p>
              </div>
              <button
                disabled={!detailsSaved}
                className={`bg-green-500 w-full text-lg font-bold py-2 text-black hover:bg-green-400 ${
                  !detailsSaved && "opacity-50 cursor-not-allowed" // Highlighted change: Apply opacity and cursor style when disabled
                }`}
                onClick={handlePayment}
              >
                Pay Now ->>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex w-full justify-center items-center flex-col my-6">
              <img src={emptyCartImage} className="w-full max-w-sm" />
              <p className="text-slate-500 text-3xl font-bold">Empty Cart</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
