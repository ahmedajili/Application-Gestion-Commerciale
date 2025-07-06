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
  getTiers as onGetTiers,
  addNewArticle as onAddNewArticle,
  updateArticle as onUpdateArticle,
  deleteArticle as onDeleteArticle,
  
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

const Tiers = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const printPage = () => {
    window.print();
  };

  // cas tiers
  const selectLayoutStateTiers = (state) => state.Tiers;
  const tiersProperties = createSelector(
    selectLayoutStateTiers,
    (ecom) => ({
      tiers: ecom.tiers,
      isTiersSuccess: ecom.isTiersSuccess,
      errorTiers: ecom.error,
    })
  );
  // Inside your component
  const {
    tiers, isTiersSuccess, errorTiers
  } = useSelector(tiersProperties)

  const [isEdit, setIsEdit] = useState(false);
  const [tier, setTier] = useState([]);
 
 useEffect(() => {
  if (!isTiersSuccess && !tiers.length) {
    dispatch(onGetTiers());
  }
}, [isTiersSuccess, tiers, dispatch]);


  useEffect(() => {
    setTier(tiers);
  }, [tiers]);

  useEffect(() => {
    if (!isEmpty(tiers)) {
      setTier(tiers);
      setIsEdit(false);
    }
  }, [tiers]);


  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTier(null);

    } else {
      setModal(true);
    }
  }, [modal]);



  // Delete Data Article
  const onClickDeleteArt = (article) => {
    setTier(article);
    setDeleteModal(true);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
     /* designation: (article && article.designation) || '',
      unite: (article && article.unite) || '',
      prix_U_A_HT: (article && article.prix_U_A_HT) || 0,
      prix_U_V_HT: (article && article.prix_U_V_HT) || 0,
      taux_TVA: (article && article.taux_TVA) || 0,
      fodec: (article && article.fodec) || 0,
      stockable: (article && article.stockable) || false,
      categorie: (article && article.id_CategorieArticle) || '',*/
     
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

      
    }),
    onSubmit: (values) => {
      if (isEdit) {
      
        const updateArticle = {
          id: article ? article.id : 0,
          designation: values.designation,
          unite: values.unite,
          prix_U_A_HT: values.prix_U_A_HT,
          prix_U_V_HT: values.prix_U_V_HT,
          taux_TVA: values.taux_TVA,
          fodec: values.fodec,
          stockable: values.stockable,
          id_CategorieArticle: values.categorie,
         
        };
        // update article
        dispatch(onUpdateArticle(updateArticle));
        validation.resetForm();
        setIsEdit(false);
        setArticle(null);
      } else {
        const newarticle = {
          designation: values["designation"],
          unite: values["unite"],
          prix_U_A_HT: values["prix_U_A_HT"],
          prix_U_V_HT: values["prix_U_V_HT"],
          taux_TVA: values["taux_TVA"],
          fodec: values["fodec"],
          stockable: values["stockable"],
          id_CategorieArticle: values["categorie"],
        };
       
        dispatch(onAddNewArticle(newarticle));
        validation.resetForm();
        
      }
      history("/apps-articles");
      toggle();
    },
  });


  // Delete Data Article
  const handleDeleteArticle = () => {
    if (article) {
      dispatch(onDeleteArticle(article.id));
      setDeleteModal(false);
    }
  };


    // Update Data articles
    const handleArticleClick = useCallback((arg) => {
      const article = arg;
      //console.log(article);
      setArticle({
        id: article.id,
        designation: article.designation,
        unite: article.unite,
        prix_U_A_HT: article.prix_U_A_HT,
        prix_U_V_HT: article.prix_U_V_HT,
        taux_TVA: article.taux_TVA,
        fodec: article.fodec,
        stockable: article.stockable,
        id_CategorieArticle: article.id_CategorieArticle,
      });
  
      setIsEdit(true);
      validation.setValues({
        designation: article.designation,
        unite: article.unite,
        prix_U_A_HT: article.prix_U_A_HT,
        prix_U_V_HT: article.prix_U_V_HT,
        taux_TVA: article.taux_TVA,
        fodec: article.fodec,
        stockable: article.stockable,
        id_CategorieArticle: article.id_CategorieArticle,
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
      dispatch(onDeleteArticle(element.value));
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

 //  tiers Column
 const columns1 = useMemo(
  () => {
  
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
      header: "Code Tiers",
      accessorKey: "idTiers",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Type",
      accessorKey: "type",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Raison Sociale / Nom et Prénom",
      accessorFn: (row) => {
    if (row.raisonSociale) {
      return row.raisonSociale;
    } else {
      // Si nom et prénom sont tous les deux vides, afficher une valeur vide
      const nomPrenom = [row.nom, row.prenom].filter(Boolean).join(" ");
      return nomPrenom || "-";
    }
  },
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Matricule Fiscale / CIN",
      accessorFn: (row) => {
    if (row.matriculeFiscale) {
      return row.matriculeFiscale;
    } else {
      return row.cin || "-";
    }
  },
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Adresse",
      accessorKey: "adresse",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Email",
      accessorKey: "email",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "RIB",
      accessorKey: "rib",
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
                onClick={() => { const articleData = cellProps.row.original; handleArticleClick(articleData); }}
              >

                <i className="ri-pencil-fill fs-16"></i>
              </Link>
            </li>
            <li className="list-inline-item" title="Supprimer">
              <Link
                to="#"
                className="text-danger d-inline-block remove-item-btn"
                onClick={() => { const articleData = cellProps.row.original; onClickDeleteArt(articleData); }}
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
  },[checkedAll]);


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

  document.title = "Tiers | Application Gestion Commerciale";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportPDFModal
          show={isExportPDF}
          onCloseClick={() => setIsExportPDF(false)}
          data={tiers}
          columns={[
            //{ field: "id", label: "ID" },
            { field: "idTiers", label: "Code Tiers" },
            { field: "type", label: "Type" },
            { field: "raisonSociale", label: "Raison Sociale / Nom et Prénom", format: (_, row) => row.raisonSociale || [row.nom, row.prenom].filter(Boolean).join(" ") || "-"},
            { field: "matriculeFiscale", label: "Matricule Fiscale / CIN", format: (_, row) => row.matriculeFiscale || row.cin || "-" },
            { field: "adresse", label: "Adresse" },
            { field: "email", label: "Email" },
            { field: "rib", label: "RIB" },
          ]}
          title="Liste des tiers"
          filename="Tiers"
        />

        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={tiers}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteArticle}
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
          <BreadCrumb title="Tiers" pageTitle="Base" />
          <Row>
            <Col lg={12}>
              <Card id="tiersList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 print-visible-title">Liste des tiers</h5>
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
                    {!isTiersSuccess ? (
                      <Loader error={errorTiers} />
                    ) : tiers.length === 0 ? (
                      <Alert color="secondary" className="text-center">
                        <strong>Aucun tier trouvé. Veuillez ajouter un.</strong>
                      </Alert>
                    ) : (
                       <TableContainer
                        columns={columns1}
                        data={(tiers || [])}
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
                      {!!isEdit ? "Modifier un tier" : "Ajouter un tier"}
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
                            value={validation.values.prix_U_A_HT ?? ""}
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
                            value={validation.values.prix_U_V_HT ?? ""}
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
                            value={validation.values.taux_TVA ?? ""}
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
                            value={validation.values.fodec ?? ""}
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
                    
                      </div>
                        </div>
                         
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); setTier(null); }}> Fermer </button>

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

export default Tiers;
