import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
};

const DataSlice = createSlice({
  name: "reducer",
  initialState,
  reducers: {
    fetchData: (state, action) => {
      state.data = action.payload.data;
    },
  },
});

export const { fetchData } = DataSlice.actions;

export default DataSlice.reducer;
