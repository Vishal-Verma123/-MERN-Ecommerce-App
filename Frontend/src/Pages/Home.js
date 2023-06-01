import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CardFeature from "../Components/CardFeature";
import HomeCard from "../Components/HomeCard";
import { GrPrevious, GrNext } from "react-icons/gr";
import AllProduct from "../Components/AllProduct";

const Home = () => {
  const productData = useSelector((state) => state.product.productList);
  const homeProductCartList = productData.slice(1, 7);
  const homeProductCartListVegetables = productData.filter(
    (el) => el.category === "vegetable",
    []
  );
  const loadingArray = new Array(6).fill(null);
  const loadingArrayFeature = new Array(10).fill(null);

  const slideProductRef = useRef();
  const nextProduct = () => {
    slideProductRef.current.scrollLeft += 200;
  };
  const preveProduct = () => {
    slideProductRef.current.scrollLeft -= 200;
  };

  return (
    <div className="p-10 md:p-14 bg-slate-100">
      <div className="md:flex gap-4 py-2">
        <div className="md:w-1/2">
          <div className="flex gap-2 bg-slate-300 w-36 px-2 items-center rounded-full">
            <p className="text-sm font-medium text-slate-900">Bike Delivery</p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
              className="h-8"
            />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold flex flex-col py-3">
            Unlock The World Of Fresh Groceries{" "}
            <span className="text-red-600 text-">
              Explore a wide selection and order with ease
            </span>
          </h2>
          <p className="text-base py-2 max-w-lg">
            A grocery shopping is an android application where users can
            purchase and order groceries online. The system is developed with a
            user-friendly and attractive GUI. It delivers a wide range of
            groceries available online.Users have to first login into the system
            to view the groceries and add them into their cart. They can then
            order it by making a secure online payment via CREDIT CARD. The
            system functionality of products and orders is stored on server side
            in a web service. The android app is for client usage. It consists
            of client side scripting for placing orders by connecting to the
            server side webservice.
          </p>
          <button className=" font-bold bg-red-500 text-slate-200 px-4 py-2 rounded my-2">
            Order Now
          </button>
        </div>

        {/* <div className="md:w-1/2 flex flex-wrap gap-3 p-14 justify item-center">
          {homeProductCartList[0]
            ? homeProductCartList.map((el) => {
                return (
                  <HomeCard
                    key={el._id}
                    id={el._id}
                    image={el.image}
                    name={el.name}
                    price={el.price}
                    category={el.category}
                  />
                );
              })
            : loadingArray.map((el, index) => {
                return (
                  <HomeCard key={index + "loading"} loading={"Loading..."} />
                );
              })}
        </div> */}
        <div className="md:w-1/2 p-18">
          {homeProductCartList[0] &&
            homeProductCartList.map((el) => {
              return (
                <HomeCard
                  image={el.image}
                  name={el.name}
                  price={el.price}
                  category={el.category}
                />
              );
            })}
        </div>
      </div>

      <div className="my-2">
        <div className="flex w-full items-center">
          <h2 className="font-bold text-2xl text-slate-800 mb-4 mt-3 ">
            Fresh Vegetables
          </h2>
          <div className="ml-auto flex gap-4">
            <button
              onClick={preveProduct}
              className="bg-slate-300 hover:bg-slate-400 text-lg  p-1 rounded"
            >
              <GrPrevious />
            </button>
            <button
              onClick={nextProduct}
              className="bg-slate-300 hover:bg-slate-400 text-lg p-1 rounded "
            >
              <GrNext />
            </button>
          </div>
        </div>
        <div
          className="flex gap-5 overflow-scroll scrollbar-none scroll-smooth transition-all"
          ref={slideProductRef}
        >
          {homeProductCartListVegetables[0]
            ? homeProductCartListVegetables.map((el) => {
                return (
                  <CardFeature
                    key={el._id + "vegetable"}
                    id={el._id}
                    name={el.name}
                    category={el.category}
                    price={el.price}
                    image={el.image}
                  />
                );
              })
            : loadingArrayFeature.map((el, index) => (
                <CardFeature loading="Loading..." key={index + "cartLoading"} />
              ))}
        </div>
      </div>

      <AllProduct heading={"Your Product"} />
    </div>
  );
};

export default Home;
