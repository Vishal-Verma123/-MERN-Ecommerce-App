import "./App.css";
import Header from "./Components/Header";
import { Route, Routes } from "react-router-dom";
import About from "./Pages/About";
import Signup from "./Pages/Signup";
import toast, { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";
import Menu from "./Pages/Menu";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Newproduct from "./Pages/Newproduct";
import Cart from "./Pages/Cart";
import { useEffect } from "react";
import { setDataProduct } from "./redux/productSlide";
import { useDispatch, useSelector } from "react-redux";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";

function App() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/product`);
      const resData = await res.json();
      console.log(resData);
      dispatch(setDataProduct(resData));
    })();
  }, []);

  console.log(productData);
  return (
    <>
      <Toaster />
      <div>
        <Header />,
        {/* <main className="pt-16 bg-slate-100 min-h-[calc(100vsh)]"></main>, */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="signup" element={<Signup />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu:/filterby" element={<Menu />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="newproduct" element={<Newproduct />} />
          <Route path="cart" element={<Cart />} />
          <Route path="cancel" element={<Cancel />} />
          <Route path="success" element={<Success />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
