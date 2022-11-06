import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slice.jsx";

const store = configureStore({
  reducer: {
    reducer,
  },
});

export default store;
