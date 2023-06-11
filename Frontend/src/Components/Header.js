import React, { useState } from "react";
import logo from "../pictures/logo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { logoutRedux } from "../redux/userSlice";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutRedux());
    toast("Logout Successfully!!");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const cartItemNumber = useSelector((state) => state.product.cartItem);

  return (
    <header className="fixed shadow-md w-full h-16 px-2 md:px-4 z-50 bg-white">
      {/*desktop*/}
      <div className="flex items-center h-full justify-between">
        <Link to={""}>
          <div className="h-16 flex">
            <img src={logo} className="h-full" alt="Logo" />
            <h1 className="justify-between text-slate-900 m-auto font-bold text-base md:text-2xl ">
              The Best Online Grocery Shop
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-7">
          <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
            <Link to={""} className="hover:text-red-600">
              Home
            </Link>
            <Link
              to={"menu/6470d17db66fcb7572d2092d"}
              className="hover:text-red-600"
            >
              Menu
            </Link>
            <Link to={"about"} className="hover:text-red-600">
              About
            </Link>
            <Link to={"contact"} className="hover:text-red-600">
              Contact
            </Link>
          </nav>
          <div className="text-2xl text-slate-600 relative">
            <Link to={"cart"}>
              <TiShoppingCart />
              <div className="absolute -top-2 -right-1 text-white bg-red-500 h-4 w-4 rounded-full m-0 p-0 text-sm text-center">
                {cartItemNumber.length}
              </div>
            </Link>
          </div>
          <div className="text-slate-600" onClick={handleShowMenu}>
            <div className="text-3xl cursor-pointer w-8 h-8 rounded-full overflow-hidden drop-shadow-md">
              {userData.image ? (
                <img src={userData.image} className="h-full w-full" />
              ) : (
                <FaUserCircle />
              )}
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white py-2  shadow drop-shadow-md flex flex-col min-w-[120px] text-center">
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link
                    to={"newproduct"}
                    className="whitespace-nowrap cursor-pointer px-2"
                  >
                    New product
                  </Link>
                )}

                {userData.email ? (
                  <>
                    <Link
                      to={"myprofile"}
                      className="cursor-pointer text-black px-2 bg-white "
                    >
                      MyProfile{" "}
                    </Link>

                    <p className="cursor-pointer text-black px-2 bg-white ">
                      Transactions{" "}
                    </p>
                    <p
                      className="cursor-pointer text-white px-2 bg-red-400"
                      onClick={handleLogout}
                    >
                      Logout {userData.firstName}{" "}
                    </p>
                  </>
                ) : (
                  <Link
                    to={"login"}
                    className="whitespace-nowrap cursor-pointer px-2"
                  >
                    Login
                  </Link>
                )}
                <nav className="text-base md:text-lg flex flex-col md:hidden">
                  <Link to={""} className="px-2 py-1">
                    Home
                  </Link>
                  <Link
                    to={"menu/6470d17db66fcb7572d2092d"}
                    className="px-2 py-1"
                  >
                    Menu
                  </Link>
                  <Link to={"about"} className="px-2 py-1">
                    About
                  </Link>
                  <Link to={"contact"} className="px-2 py-1">
                    Contact
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile */}
    </header>
  );
};

export default Header;
