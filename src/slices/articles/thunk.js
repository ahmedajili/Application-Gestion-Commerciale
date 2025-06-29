import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    getArticles as getArticlesApi,
    addNewArticle as addNewArticleApi,
    updateArticle as updateArticleApi,
    deleteArticle as deleteArticleApi,
    
  } from "../../helpers/fakebackend_helper";


export const getArticles = createAsyncThunk("articles/getArticles", async () => {
  try {
    const response = getArticlesApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewArticle = createAsyncThunk("articles/addNewArticle", async (article) => {
  try {
    const response = await addNewArticleApi(article);
    toast.success("Article ajouté avec succés", { autoClose: 3000 });
    //console.log(response);
    return response;
  } catch (error) {
    toast.error("Echec d'ajout", { autoClose: 3000 });
    return error;
  }
});

export const updateArticle = createAsyncThunk("articles/updateArticle", async (article) => {
  try {
    const response = updateArticleApi(article);
    const data = await response;
    toast.success("Article modifié avec succés", { autoClose: 3000 });
    //console.log("la data est " ,data);
    return data;
  } catch (error) {
    toast.error("Echec de modification", { autoClose: 3000 });
    return error;
  }
});

export const deleteArticle = createAsyncThunk("articles/deleteArticle", async (idarticle) => {
  try {
    const response = await deleteArticleApi(idarticle);
    toast.success("Article supprimé avec succés", { autoClose: 3000 });
    //console.log({ idcategorie, ...response })
    return { idarticle, ...response }
  } catch (error) {
    toast.error("Echec de la suppression", { autoClose: 3000 });
    return error;
  }
});