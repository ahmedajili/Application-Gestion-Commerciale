import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback,
  Alert
} from "reactstrap";

import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";
import * as moment from "moment";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
  getCategoriesArticles as onGetCategoriesArticles,
  getArticles as onGetArticles,
  addNewCategorie as onAddNewCategorie,
  updateCategorie as onUpdateCategorie,
  deleteCategorie as onDeleteCategorie,
} from "../../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import { createSelector } from "reselect";
import ExportPDFModal from "../../../Components/Common/ExportPDFModal";
import Select from "react-select";

const Articles = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const printPage = () => {
    window.print();
  };

// cas catégories
  const selectLayoutStateCat = (state) => state.CategoriesArticles;
  const categorieArticleProperties = createSelector(
    selectLayoutStateCat,
    (ecom) => ({
      categoriesArticles: ecom.categoriesArticles,
      isCategoriesSuccess: ecom.isCategoriesSuccess,
      errorCat: ecom.error,
    })
  );
  // Inside your component
  const {
    categoriesArticles, isCategoriesSuccess, errorCat
  } = useSelector(categorieArticleProperties)

  // cas articles
  const selectLayoutStateArt = (state) => state.Articles;
  const articleProperties = createSelector(
    selectLayoutStateArt,
    (ecom) => ({
      articles: ecom.articles,
      isArticlesSuccess: ecom.isArticlesSuccess,
      errorArt: ecom.error,
    })
  );
  // Inside your component
  const {
    articles, isArticlesSuccess, errorArt
  } = useSelector(articleProperties)

  const [isEdit, setIsEdit] = useState(false);
  const [article, setArticle] = useState([]);
 
  useEffect(() => {
  if (!isCategoriesSuccess && !categoriesArticles.length) {
    dispatch(onGetCategoriesArticles());
  }
}, [isCategoriesSuccess, categoriesArticles, dispatch]);

 useEffect(() => {
  if (!isArticlesSuccess && !articles.length) {
    dispatch(onGetArticles());
  }
}, [isArticlesSuccess, articles, dispatch]);


  useEffect(() => {
    setArticle(articles);
  }, [articles]);

  useEffect(() => {
    if (!isEmpty(articles)) {
      setArticle(articles);
      setIsEdit(false);
    }
  }, [articles]);

useEffect(() => {
  if (!isCategoriesSuccess && !categoriesArticles.length) {
    dispatch(onGetCategoriesArticles());
  }
}, [isCategoriesSuccess, categoriesArticles, dispatch]);



const categorieOptions = categoriesArticles.map((cat) => ({
  value: cat.id,
  label: cat.libelle,
}));



const formatPrix = (val, forPDF = false) => {
  const str = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(val);

  return forPDF ? str.replace(/\u202F/g, " ") : str;
};

  const getCategorieLibellePDF = (id) => {
  const found = categoriesArticles.find((cat) => cat.id === id);
  return found ? found.libelle : 'Inconnu';
};


  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setArticle(null);

    } else {
      setModal(true);
    }
  }, [modal]);



  // Delete Data categorie
  const onClickDeleteCat = (categorie) => {
    setArticle(categorie);
    setDeleteModal(true);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      designation: (article && article.designation) || '',
      unite: (article && article.unite) || '',
      prix_U_A_HT: (article && article.prix_U_A_HT) || '',
      prix_U_V_HT: (article && article.prix_U_V_HT) || '',
      taux_TVA: (article && article.taux_TVA) || '',
      fodec: (article && article.fodec) || '',
      stockable: (article && article.stockable) || false,
      categorie: (article && article.id_CategorieArticle) || '',
      //customer: (customer && customer.customer) || '',
      //email: (customer && customer.email) || '',
      //phone: (customer && customer.phone) || '',
      //date: (customer && customer.date) || '',
      //status: (customer && customer.status) || '',
    },
    validationSchema: Yup.object({
      designation: Yup.string().required("Champs requis"),
      unite: Yup.string().required("Champs requis"),
      prix_U_A_HT: Yup.number().typeError("Veuillez entrer un nombre valide")
                    .required("Champs requis")
                    .min(0, "Le prix ne peut pas être négatif"),
      prix_U_V_HT: Yup.number().typeError("Veuillez entrer un nombre valide")
                    .required("Champs requis")
                    .min(0, "Le prix ne peut pas être négatif"),
      taux_TVA: Yup.number().typeError("Veuillez entrer un nombre valide")
                    .required("Champs requis")
                    .min(0, "Le prix ne peut pas être négatif"),
      fodec: Yup.number().typeError("Veuillez entrer un nombre valide")
                    .required("Champs requis")
                    .min(0, "Le prix ne peut pas être négatif"),
      stockable: Yup.boolean().required("Champs requis"),
      categorie: Yup.number().required("Champs requis"),

      //customer: Yup.string().required("Please Enter Customer Name"),
      //email: Yup.string().required("Please Enter Your Email"),
      //phone: Yup.string().required("Please Enter Your Phone"),
      //status: Yup.string().required("Please Enter Your Status")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        /*const updateCustomer = {
          _id: customer ? customer._id : 0,
          customer: values.customer,
          email: values.email,
          phone: values.phone,
          date: date,
          status: values.status,
        };*/
        const updateCategorie = {
          id: article ? article.id : 0,
          libelle: values.libelle,
         
        };
        // update customer
        dispatch(onUpdateCategorie(updateCategorie));
        validation.resetForm();
        setIsEdit(false);
        setArticle(null);
      } else {
        const newlibelle = {
          libelle: values["libelle"],
        };
        /*const newCustomer = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          customer: values["customer"],
          email: values["email"],
          phone: values["phone"],
          date: date,
          status: values["status"]
        };*/
        // save new customer
        //dispatch(onAddNewCustomer(newCustomer));
        //console.log("mercii");
        dispatch(onAddNewCategorie(newlibelle));
        validation.resetForm();
        
      }
      history("/apps-categories-articles");
      toggle();
    },
  });


  // Delete Data Categorie
  const handleDeleteCategorie = () => {
    if (article) {
      dispatch(onDeleteCategorie(article.id));
      setDeleteModal(false);
    }
  };


    // Update Data categories
    const handleCategorieClick = useCallback((arg) => {
      const categorie = arg;
  
      setArticle({
        id: categorie.id,
        libelle: categorie.libelle,
        
      });
  
      setIsEdit(true);
      validation.setValues({
    libelle: categorie.libelle,
  });
      toggle();
    }, [toggle]);



  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".customerCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteCategorie(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
    checkedAll();
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".customerCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

 //  articles Column
 const columns1 = useMemo(
  () => {
    const getCategorieLibelle = (id) => {
  const found = categoriesArticles.find((cat) => cat.id === id);
  return found ? found.libelle : 'Inconnu';
};
return [
    {
      header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
      cell: (cell) => {
        return <input type="checkbox" className="customerCheckBox form-check-input" value={cell.getValue()} onChange={() => deleteCheckbox()} />;
      },
      id: '#',
      accessorKey: 'id',
      enableColumnFilter: false,
      enableSorting: false,
      meta: { className: "no-print" }
    },
    {
      header: "Désignation",
      accessorKey: "designation",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Unité",
      accessorKey: "unite",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
     {
      header: "Prix Uni Achat HT (DT)",
      accessorKey: "prix_U_A_HT",
      cell: ({ getValue }) => formatPrix(getValue()),
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Prix Uni Vente HT (DT)",
      accessorKey: "prix_U_V_HT",
      cell: ({ getValue }) => formatPrix(getValue()),
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Taux TVA (%)",
      accessorKey: "taux_TVA",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Fodec (%)",
      accessorKey: "fodec",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Stock",
      accessorKey: "stockable",
      cell: ({ getValue }) => (
    <span className={`badge rounded-pill border ${getValue() ? 'border-success text-success' : 'border-danger text-danger'}`}>
      {getValue() ? 'Stockable' : 'Non stockable'}
    </span>
  ),
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Catégorie",
      accessorKey: "id_CategorieArticle",
      cell: ({ getValue }) => getCategorieLibelle(getValue()),
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Action",
      cell: (cellProps) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit" title="Modifier">
              <Link
                to="#"
                className="text-primary d-inline-block edit-item-btn"
                onClick={() => { const categorieData = cellProps.row.original; handleCategorieClick(categorieData); }}
              >

                <i className="ri-pencil-fill fs-16"></i>
              </Link>
            </li>
            <li className="list-inline-item" title="Supprimer">
              <Link
                to="#"
                className="text-danger d-inline-block remove-item-btn"
                onClick={() => { const categorieData = cellProps.row.original; onClickDeleteCat(categorieData); }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </li>
          </ul>
        );
      },
      meta: { className: "no-print" }
    },
  ];
  },[checkedAll,categoriesArticles]);


  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [isExportPDF, setIsExportPDF] = useState(false);

  document.title = "Articles | Application Gestion Commerciale";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportPDFModal
          show={isExportPDF}
          onCloseClick={() => setIsExportPDF(false)}
          data={articles}
          columns={[
            //{ field: "id", label: "ID" },
            { field: "designation", label: "Désignation" },
            { field: "unite", label: "Unité" },
            { field: "prix_U_A_HT", label: "Prix Uni Achat HT (DT)", format: (val) => formatPrix(val, true)},
            { field: "prix_U_V_HT", label: "Prix Uni Vente HT (DT)", format: (val) => formatPrix(val, true) },
            { field: "taux_TVA", label: "Taux TVA (%)" },
            { field: "fodec", label: "Fodec (%)" },
            { field: "stockable", label: "Stock", format: (val) => (val ? "Stockable" : "Non stockable") },
            { field: "id_CategorieArticle", label: "Catégorie", format: (val) => getCategorieLibellePDF(val) },
          ]}
          title="Liste des articles"
          filename="Articles"
        />

        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={articles}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCategorie}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Articles" pageTitle="Base" />
          <Row>
            <Col lg={12}>
              <Card id="articlesList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 print-visible-title">Liste des articles</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto no-print">
                      <div>
                        {isMultiDeleteButton && <button className="btn btn-soft-danger me-1"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Ajouter
                        </button>{" "}
                        <button type="button" className="btn btn-info" onClick={() => setIsExportCSV(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          CSV
                        </button>
                        {" "}
                        <button type="button" className="btn btn-info" onClick={() => setIsExportPDF(true)}>
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          PDF
                        </button>
                        {" "}
                        <Link
                         to="#"
                         onClick={printPage}
                         className="btn btn-light no-print"
                        >
                        <i className="ri-printer-line align-bottom me-1"></i> Imprimer
                        </Link>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    {!isArticlesSuccess ? (
                      <Loader error={errorArt} />
                    ) : articles.length === 0 ? (
                      <Alert color="secondary" className="text-center">
                        <strong>Aucun article trouvée. Veuillez ajouter un.</strong>
                      </Alert>
                    ) : (
                       <TableContainer
                        columns={columns1}
                        data={(articles || [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={10}
                        className="custom-header-css"
                        //handleCustomerClick={handleCustomerClicks}
                        isCustomerFilter={false}
                        SearchPlaceholder='Rechercher'
                      />
                    )
                    }

                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Modifier un article" : "Ajouter un article"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={validation.handleSubmit}>
                       
                      <ModalBody>
                        <input type="hidden" id="id-field" />
                        <div className="row">
                        <div className="col-md-6">
                        <div
                          className="mb-3"
                          id="modal-id"
                          style={{ display: "none" }}
                        >
                          <Label htmlFor="id-field1" className="form-label">
                            ID
                          </Label>
                          <Input
                            type="text"
                            id="id-field1"
                            className="form-control"
                            placeholder="ID"
                            readOnly
                          />
                        </div>

                        <div className="mb-3">
                          <Label
                            htmlFor="designation-field"
                            className="form-label"
                          >
                            Désignation *
                          </Label>
                          <Input
                            name="designation"
                            id="designation-field"
                            className="form-control"
                            placeholder="Saisir une désignation"
                            type="text"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.designation || ""}
                            invalid={
                              validation.touched.designation && validation.errors.designation ? true : false
                            }
                          />
                          {validation.touched.designation && validation.errors.designation ? (
                            <FormFeedback type="invalid">{validation.errors.designation}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label
                            htmlFor="unite-field"
                            className="form-label"
                          >
                            Unité *
                          </Label>
                          <Input
                            name="unite"
                            id="unite-field"
                            className="form-control"
                            placeholder="Saisir une unité"
                            type="text"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.unite || ""}
                            invalid={
                              validation.touched.unite && validation.errors.unite ? true : false
                            }
                          />
                          {validation.touched.unite && validation.errors.unite ? (
                            <FormFeedback type="invalid">{validation.errors.unite}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label
                            htmlFor="Prix-U-A-HT-field"
                            className="form-label"
                          >
                            Prix Unitaire Achat HT (DT) *
                          </Label>
                          <Input
                            name="prix_U_A_HT"
                            id="Prix-U-A-HT-field"
                            className="form-control"
                            placeholder="Saisir un prix"
                            type="number"
                            step="0.001"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.prix_U_A_HT || ""}
                            invalid={
                              validation.touched.prix_U_A_HT && validation.errors.prix_U_A_HT ? true : false
                            }
                          />
                          {validation.touched.prix_U_A_HT && validation.errors.prix_U_A_HT ? (
                            <FormFeedback type="invalid">{validation.errors.prix_U_A_HT}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label
                            htmlFor="Prix-U-V-HT-field"
                            className="form-label"
                          >
                            Prix Unitaire Vente HT (DT) *
                          </Label>
                          <Input
                            name="prix_U_V_HT"
                            id="Prix-U-V-HT-field"
                            className="form-control"
                            placeholder="Saisir un prix"
                            type="number"
                            step="0.001"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.prix_U_V_HT || ""}
                            invalid={
                              validation.touched.prix_U_V_HT && validation.errors.prix_U_V_HT ? true : false
                            }
                          />
                          {validation.touched.prix_U_V_HT && validation.errors.prix_U_V_HT ? (
                            <FormFeedback type="invalid">{validation.errors.prix_U_V_HT}</FormFeedback>
                          ) : null}
                        </div>
                        </div>
                        <div className="col-md-6">
                        <div className="mb-3">
                          <Label
                            htmlFor="Taux-TVA-field"
                            className="form-label"
                          >
                            Taux TVA (%) *
                          </Label>
                          <Input
                            name="taux_TVA"
                            id="Taux-TVA-field"
                            className="form-control"
                            placeholder="Saisir un taux TVA"
                            type="number"
                            step="0.001"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.taux_TVA || ""}
                            invalid={
                              validation.touched.taux_TVA && validation.errors.taux_TVA ? true : false
                            }
                          />
                          {validation.touched.taux_TVA && validation.errors.taux_TVA ? (
                            <FormFeedback type="invalid">{validation.errors.taux_TVA}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label
                            htmlFor="Fodec-field"
                            className="form-label"
                          >
                            Fodec (%) *
                          </Label>
                          <Input
                            name="fodec"
                            id="Fodec-field"
                            className="form-control"
                            placeholder="Saisir Fodec"
                            type="number"
                            step="0.001"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.fodec || ""}
                            invalid={
                              validation.touched.fodec && validation.errors.fodec ? true : false
                            }
                          />
                          {validation.touched.fodec && validation.errors.fodec ? (
                            <FormFeedback type="invalid">{validation.errors.fodec}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3 form-check">
                        <Input
                          type="checkbox"
                          name="stockable"
                          id="stockable-field"
                          className="form-check-input"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          checked={validation.values.stockable || false}
                        />
                        <Label htmlFor="stockable-field" className="form-check-label">
                          Stockable *
                        </Label>
                        {validation.touched.stockable && validation.errors.stockable ? (
                          <FormFeedback type="invalid" className="d-block">
                            {validation.errors.stockable}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                      <Label htmlFor="categorie-field" className="form-label">
                        Catégorie *
                      </Label>
                      <Select
                        inputId="categorie-field"
                        name="categorie"
                        options={categorieOptions}
                        onChange={(selectedOption) =>
                          validation.setFieldValue("categorie", selectedOption ? selectedOption.value : "")
                        }
                        onBlur={() => validation.setFieldTouched("categorie", true)}
                        value={
                          categorieOptions.find(
                            (option) => option.value === validation.values.categorie
                          ) || null
                        }
                        classNamePrefix="react-select"
                        className={
                          validation.touched.categorie && validation.errors.categorie
                            ? "is-invalid"
                            : ""
                        }
                        placeholder="Sélectionner une catégorie..."
                      />
                      {validation.touched.categorie && validation.errors.categorie ? (
                        <div className="invalid-feedback d-block">
                          {validation.errors.categorie}
                        </div>
                      ) : null}
                    </div>
                      </div>
                        </div>
                         {/*
                        <div className="mb-3">
                          <Label htmlFor="email-field" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            type="email"
                            id="email-field"
                            placeholder="Enter Email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email && validation.errors.email ? true : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          ) : null}

                        </div>

                        <div className="mb-3">
                          <Label htmlFor="phone-field" className="form-label">
                            Phone
                          </Label>
                          <Input
                            name="phone"
                            type="text"
                            id="phone-field"
                            placeholder="Enter Phone no."
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phone || ""}
                            invalid={
                              validation.touched.phone && validation.errors.phone ? true : false
                            }
                          />
                          {validation.touched.phone && validation.errors.phone ? (
                            <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback>
                          ) : null}

                        </div>

                        <div className="mb-3">
                          <Label htmlFor="date-field" className="form-label">
                            Joining Date
                          </Label>

                          <Flatpickr
                            name="date"
                            id="date-field"
                            className="form-control"
                            placeholder="Select a date"
                            options={{
                              altInput: true,
                              altFormat: "d M, Y",
                              dateFormat: "d M, Y",
                            }}
                            onChange={(e) =>
                              dateformate(e)
                            }
                            value={validation.values.date || ""}
                          />
                          {validation.touched.date && validation.errors.date ? (
                            <FormFeedback type="invalid">{validation.errors.date}</FormFeedback>
                          ) : null}
                        </div>

                        <div>
                          <Label htmlFor="status-field" className="form-label">
                            Status
                          </Label>

                          <Input
                            name="status"
                            type="select"
                            className="form-select"
                            id="status-field"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={
                              validation.values.status || ""
                            }
                          >
                            {customermocalstatus.map((item, key) => (
                              <React.Fragment key={key}>
                                {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                              </React.Fragment>
                            ))}
                          </Input>
                          {validation.touched.status &&
                            validation.errors.status ? (
                            <FormFeedback type="invalid">
                              {validation.errors.status}
                            </FormFeedback>
                          ) : null}
                        </div>*/}
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); setArticle(null); }}> Fermer </button>

                          <button type="submit" className="btn btn-success"> {!!isEdit ? "Modifier" : "Ajouter"} </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Articles;
