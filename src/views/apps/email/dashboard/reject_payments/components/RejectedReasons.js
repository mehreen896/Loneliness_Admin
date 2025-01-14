import React, { useState, Fragment } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Eye, Plus, Trash2 } from "react-feather";
import { Card, CardTitle, CardHeader, Button } from "reactstrap";
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { rejectPaymentColumns } from "../../../../user/view/columns";
import {
  useGetRejectedPaymentsQuery,
  useReleasePaymentMutation,
} from "../../../../../../redux/api";
import ComponentSpinner from "../../../../../../@core/components/spinner/Loading-spinner";
import { useNavigate } from "react-router-dom";
import ReleasePaymentModal from "./ReleasePaymentModal"; // Import the modal

const RejectedReason = ({ token, page }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("id");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, error, isLoading, isFetching, refetch } =
    useGetRejectedPaymentsQuery({
      page: currentPage,
      limit: rowsPerPage,
      token,
    });
  const [releasePayment, { isLoading: releasingPayment }] =
    useReleasePaymentMutation();

  const navigate = useNavigate();

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleReleaseClick = (row) => {
    setSelectedRow(row);
    toggleModal();
  };

  const handleConfirmRelease = async (release_to) => {
    const {
      request_id,
      user: { id: user_id },
      buddy: { id: buddy_id },
    } = selectedRow;
    try {
      await releasePayment({
        request_id,
        buddy_id,
        user_id,
        release_to,
        token,
      });
      refetch();
      toggleModal();
    } catch (error) {
      console.error("Failed to release payment:", error);
    }
  };

  const actionColumn = {
    name: "Actions",
    minWidth: "250px",
    cell: (row) => {
      return (
        <Fragment>
          <Button
            color="primary fw-bold"
            size="sm"
            className="me-1"
            onClick={() => handleReleaseClick(row)}
            disabled={row?.is_released}
          >
            Release
          </Button>
          <Button
            color="info"
            size="sm"
            onClick={() =>
              navigate(`/rejected-payments-details/${row.request_id}`, {
                state: {
                  userId: row.user.id,
                  userFullName: row.user.full_name,
                  userImageUrl: row.user.image_url,
                },
              })
            }
          >
            <Eye size={14} color="#FFFF" />
          </Button>
        </Fragment>
      );
    },
  };

  const columns = [...rejectPaymentColumns, actionColumn];

  const sliceData =
    page === "dashboard" ? data?.result?.data?.slice(0, 5) : data?.result?.data;

  return (
    <div className="invoice-list-wrapper">
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Rejected Payments</CardTitle>
        </CardHeader>
        {isLoading || isFetching ? (
          <ComponentSpinner />
        ) : (
          <div className="invoice-list-dataTable react-dataTable">
            <DataTable
              noHeader
              sortServer
              columns={columns}
              responsive={true}
              onSort={handleSort}
              data={sliceData || []}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              defaultSortField="id"
            />
          </div>
        )}
      </Card>
      <ReleasePaymentModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onConfirm={handleConfirmRelease}
        isLoading={releasingPayment}
      />
    </div>
  );
};

export default RejectedReason;
