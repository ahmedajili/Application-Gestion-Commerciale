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
  getCustomers as onGetCustomers,
  addNewCustomer as onAddNewCustomer,
  updateCustomer as onUpdateCustomer,
  deleteCustomer as onDeleteCustomer,
  getCategoriesArticles as onGetCategoriesArticles,
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

const Categories = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const printPage = () => {
    window.print();
  };

  /*const selectLayoutState = (state) => state.Ecommerce;
  const ecomCustomerProperties = createSelector(
    selectLayoutState,
    (ecom) => ({
      customers: ecom.customers,
      isCustomerSuccess: ecom.isCustomerSuccess,
      error: ecom.error,
    })
  );*/

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

  const [isEdit, setIsEdit] = useState(false);
  const [categorieArticle, setCategorieArticle] = useState([]);

  /*useEffect(() => {
    if (categoriesArticles && !categoriesArticles.length) {
      dispatch(onGetCategoriesArticles());
    }
  }, [dispatch, categoriesArticles]);*/

 useEffect(() => {
  if (!isCategoriesSuccess && !categoriesArticles.length) {
    dispatch(onGetCategoriesArticles());
  }
}, [isCategoriesSuccess, categoriesArticles, dispatch]);


  useEffect(() => {
    setCategorieArticle(categoriesArticles);
  }, [categoriesArticles]);

  useEffect(() => {
    if (!isEmpty(categoriesArticles)) {
      setCategorieArticle(categoriesArticles);
      setIsEdit(false);
    }
  }, [categoriesArticles]);

  // Inside your component
  /*const {
    customers, isCustomerSuccess, error
  } = useSelector(ecomCustomerProperties)*/

  
  //const [customer, setCustomer] = useState([]);

  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCategorieArticle(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  /*const customermocalstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "Active", value: "Active" },
        { label: "Block", value: "Block" },
      ],
    },
  ];*/

  // Delete Data
  /*const onClickDelete = (customer) => {
    setCustomer(customer);
    setDeleteModal(true);
  };*/

  // Delete Data categorie
  const onClickDeleteCat = (categorie) => {
    setCategorieArticle(categorie);
    setDeleteModal(true);
  };
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      libelle: (categorieArticle && categorieArticle.libelle) || '',
      //customer: (customer && customer.customer) || '',
      //email: (customer && customer.email) || '',
      //phone: (customer && customer.phone) || '',
      //date: (customer && customer.date) || '',
      //status: (customer && customer.status) || '',
    },
    validationSchema: Yup.object({
      libelle: Yup.string().required("Champs requis"),
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
          id: categorieArticle ? categorieArticle.id : 0,
          libelle: values.libelle,
         
        };
        // update customer
        dispatch(onUpdateCategorie(updateCategorie));
        validation.resetForm();
        setIsEdit(false);
        setCategorieArticle(null);
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

  // Delete Data
  /*const handleDeleteCustomer = () => {
    if (customer) {
      dispatch(onDeleteCustomer(customer._id));
      setDeleteModal(false);
    }
  };*/

  // Delete Data Categorie
  const handleDeleteCategorie = () => {
    if (categorieArticle) {
      dispatch(onDeleteCategorie(categorieArticle.id));
      setDeleteModal(false);
    }
  };

  // Update Data
  /*const handleCustomerClick = useCallback((arg) => {
    const customer = arg;

    setCustomer({
      _id: customer._id,
      customer: customer.customer,
      email: customer.email,
      phone: customer.phone,
      date: customer.date,
      status: customer.status
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);*/

    // Update Data categories
    const handleCategorieClick = useCallback((arg) => {
      const categorie = arg;
  
      setCategorieArticle({
        id: categorie.id,
        libelle: categorie.libelle,
        
      });
  
      setIsEdit(true);
      validation.setValues({
    libelle: categorie.libelle,
  });
      toggle();
    }, [toggle]);


 /* useEffect(() => {
    if (customers && !customers.length) {
      dispatch(onGetCustomers());
    }
  }, [dispatch, customers]);


  useEffect(() => {
    setCustomer(customers);
  }, [customers]);

  useEffect(() => {
    if (!isEmpty(customers)) {
      setCustomer(customers);
      setIsEdit(false);
    }
  }, [customers]);*/

  // Add Data
  /*const handleCustomerClicks = () => {
    setCustomer("");
    setIsEdit(false);
    toggle();
  };*/

  // Node API 
  // useEffect(() => {
  //   if (isCustomerCreated) {
  //     setCustomer(null);
  //     dispatch(onGetCustomers());
  //   }
  // }, [
  //   dispatch,
  //   isCustomerCreated,
  // ]);

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

 // Categories articles Column
 const columns1 = useMemo(
  () => [
    {
      header: <input type="checkbox" id="checkBoxAll" className="form-check-input no-print action-col" onClick={() => checkedAll()} />,
      cell: (cell) => {
        return <input type="checkbox" className="customerCheckBox form-check-input no-print action-col" value={cell.getValue()} onChange={() => deleteCheckbox()} />;
      },
      id: '#',
      accessorKey: 'id',
      enableColumnFilter: false,
      enableSorting: false,
      meta: { className: "no-print" }
    },
    {
      header: "Libellé",
      accessorKey: "libelle",
      enableColumnFilter: false,
      meta: { className: "print-visible" }
    },
    {
      header: "Action",
      cell: (cellProps) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0 no-print action-col">
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
  ],
  [/*handleCustomerClick,*/ checkedAll]
);

  // Customers Column
  /*const columns = useMemo(
    () => [
      {
        header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        cell: (cell) => {
          return <input type="checkbox" className="customerCheckBox form-check-input" value={cell.getValue()} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Customer",
        accessorKey: "customer",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
      },
      {
        header: "Joining Date",
        accessorKey: "date",
        enableColumnFilter: false,
        cell: (cell) => (
          <>
            {handleValidDate(cell.getValue())}
          </>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell) => {
          switch (cell.getValue()) {
            case "Active":
              return <span className="badge text-uppercase bg-success-subtle text-success"> {cell.getValue()} </span>;
            case "Block":
              return <span className="badge text-uppercase bg-danger-subtle text-danger"> {cell.getValue()} </span>;
            default:
              return <span className="badge text-uppercase bg-info-subtle text-info"> {cell.getValue()} </span>;
          }
        }
      },
      {
        header: "Action",
        cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={() => { const customerData = cellProps.row.original; handleCustomerClick(customerData); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const customerData = cellProps.row.original; onClickDelete(customerData); }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleCustomerClick, checkedAll]
  );*/

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

  document.title = "Catégories | Application Gestion Commerciale";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportPDFModal
          show={isExportPDF}
          onCloseClick={() => setIsExportPDF(false)}
          data={categoriesArticles}
          columns={[
            //{ field: "id", label: "ID" },
            { field: "libelle", label: "Libellé" },
          ]}
          title="Liste des Catégories"
          filename="catégories"
        />

        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={categoriesArticles}
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
          <BreadCrumb title="Catégories" pageTitle="Base" />
          <Row>
            <Col lg={12}>
              <Card id="categoriesList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 print-visible-title">Liste des catégories</h5>
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
                    {!isCategoriesSuccess ? (
                      <Loader error={errorCat} />
                    ) : categoriesArticles.length === 0 ? (
                      <Alert color="secondary" className="text-center">
                        <strong>Aucune catégorie trouvée. Veuillez ajouter une.</strong>
                      </Alert>
                    ) : (
                       <TableContainer
                        columns={columns1}
                        data={(categoriesArticles || [])}
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

                    {/*isCategoriesSuccess && categoriesArticles.length ? (
                      <TableContainer
                        columns={columns1}
                        data={(categoriesArticles || [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={10}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isCustomerFilter={true}
                        SearchPlaceholder='Rechercher'
                      />
                    ) : (<Loader error={errorCat} />)
                    */}
                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Modifier une catégorie" : "Ajouter une catégorie"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={validation.handleSubmit}>
                       
                      <ModalBody>
                        <input type="hidden" id="id-field" />

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
                            htmlFor="libellename-field"
                            className="form-label"
                          >
                            Libellé *
                          </Label>
                          <Input
                            name="libelle"
                            id="libellename-field"
                            className="form-control"
                            placeholder="Saisir un libellé"
                            type="text"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.libelle || ""}
                            invalid={
                              validation.touched.libelle && validation.errors.libelle ? true : false
                            }
                          />
                          {validation.touched.libelle && validation.errors.libelle ? (
                            <FormFeedback type="invalid">{validation.errors.libelle}</FormFeedback>
                          ) : null}
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
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); setCategorieArticle(null); }}> Fermer </button>

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

export default Categories;
