import { createSlice } from "@reduxjs/toolkit";
import { getArticles } from './thunk';

export const initialState = {
    articles: [],
    loading: false,
    error: null,
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
      });
  
      builder.addCase(getArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  
      
    }
  });

  export default ArticlesSlice.reducer;
