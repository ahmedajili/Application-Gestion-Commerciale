import { createSlice } from "@reduxjs/toolkit";
import { getArticles, addNewArticle, updateArticle, deleteArticle } from './thunk';

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
      
       builder.addCase(addNewArticle.fulfilled, (state, action) => {
          state.articles.push(action.payload);
           //  Tri après ajout (ordre alphabétique par designation)
          state.articles.sort((a, b) =>
          a.designation.localeCompare(b.designation)
          );
         state.isArticlesCreated = true;
      });
      builder.addCase(addNewArticle.rejected, (state, action) => {
         state.error = action.error.message || null;
       });

        builder.addCase(updateArticle.fulfilled, (state, action) => {
          state.articles = state.articles.map(article =>
          article.id.toString() === action.payload.id.toString()
            ? { ...article, ...action.payload }
           : article
               );
        });
         builder.addCase(updateArticle.rejected, (state, action) => {
         state.error = action.error.message || null;
        });
       
        builder.addCase(deleteArticle.fulfilled, (state, action) => {
          state.articles = state.articles.filter(
         article => article.id.toString() !== action.payload.idarticle.toString()
          );
        });
       builder.addCase(deleteArticle.rejected, (state, action) => {
         state.error = action.error.message || null;
         });
      
    }
  });

  export default ArticlesSlice.reducer;
