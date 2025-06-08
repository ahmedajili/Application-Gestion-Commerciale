import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getArticles as getArticlesApi,
    
  } from "../../helpers/fakebackend_helper";


export const getArticles = createAsyncThunk("articles/getArticles", async () => {
  try {
    const response = getArticlesApi();
    return response;
  } catch (error) {
    return error;
  }
});