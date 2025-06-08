import { createSlice } from "@reduxjs/toolkit";
import { getArticles } from './thunk';

export const initialState = {
    articles: [],
    loading: false,
    error: null,
    isArticlesSuccess: false, 
  };

  const ArticlesSlice = createSlice({
    name: 'ArticlesSlice',
    initialState,
    reducer: {},
    extraReducers: (builder) => {
      builder.addCase(getArticles.pending, (state) => {
        state.error = null;
        state.loading = true;
      });

      builder.addCase(getArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.loading = false;
        state.isArticlesCreated = false;
        state.isArticlesSuccess = true;
      });
  
      builder.addCase(getArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
        state.isArticlesCreated = false;
        state.isArticlesSuccess = false;
      });
  
      
    }
  });

  export default ArticlesSlice.reducer;
