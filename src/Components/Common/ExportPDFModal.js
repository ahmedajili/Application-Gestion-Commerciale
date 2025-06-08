import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportPDFModal = ({ show, onCloseClick, data, columns, title, filename }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();

     // Centrage du titre
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleText = title || "Exportation PDF";
        const textWidth = doc.getTextWidth(titleText);
        const x = (pageWidth - textWidth) / 2;
        doc.setFontSize(16);
        doc.text(titleText, x, 15);

    // Colonnes pour autoTable
    const tableColumn = columns.map(col => col.label);

    // Lignes du tableau
    const tableRows = data.map(item =>
      columns.map(col => item[col.field] || "")
    );

    autoTable(doc, {
      startY: 25,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`${filename || "export"}.pdf`);
    onCloseClick();
  };

  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalHeader toggle={onCloseClick}></ModalHeader>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <lord-icon
            src="https://cdn.lordicon.com/nocovwne.json"
            trigger="loop"
            colors="primary:#0ab39c,secondary:#f06548"
            style={{ width: "100px", height: "100px" }}
          />
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Êtes-vous sûr ?</h4>
            <p className="text-muted mx-4 mb-0">
              Êtes-vous sûr de vouloir exporter le fichier en PDF?
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            onClick={onCloseClick}
          >
            Fermer
          </button>
          <button
            type="button"
            className="btn w-sm btn-danger"
            onClick={exportToPDF}
          >
            Télécharger PDF
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

ExportPDFModal.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  filename: PropTypes.string,
};

export default ExportPDFModal;
