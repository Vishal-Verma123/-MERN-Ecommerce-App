import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  productList: [],
  cartItem: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setDataProduct: (state, action) => {
      state.productList = [...action.payload];
    },
    addCartItem: (state, action) => {
      const check = state.cartItem.some((el) => el._id === action.payload._id);
      if (check) {
        toast("Item Already in Cart");
      } else {
        toast("Item successfully Already in Cart");
        const total = action.payload.price;
        state.cartItem.push({ ...action.payload, qty: 1, total: total });
      }
    },
    deleteCartItem: (state, action) => {
      toast("One Item Deleted");
      state.cartItem = state.cartItem.filter((el) => el._id !== action.payload);
    },
    increaseQty: (state, action) => {
      const index = state.cartItem.findIndex((el) => el._id === action.payload);
      if (index !== -1) {
        state.cartItem[index].qty += 1;
        state.cartItem[index].total =
          state.cartItem[index].price * state.cartItem[index].qty;
      }
    },
    decreaseQty: (state, action) => {
      const index = state.cartItem.findIndex((el) => el._id === action.payload);
      if (index !== -1 && state.cartItem[index].qty > 1) {
        state.cartItem[index].qty -= 1;
        state.cartItem[index].total =
          state.cartItem[index].price * state.cartItem[index].qty;
      }
    },
  },
});

export const {
  setDataProduct,
  addCartItem,
  deleteCartItem,
  increaseQty,
  decreaseQty,
} = productSlice.actions;

export default productSlice.reducer;
