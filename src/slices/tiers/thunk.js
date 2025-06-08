import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getTiers as getTiersApi,
    
  } from "../../helpers/fakebackend_helper";


export const getTiers = createAsyncThunk("tiers/getTiers", async () => {
  try {
    const response = getTiersApi();
    return response;
  } catch (error) {
    return error;
  }
});