import React, { useState } from "react";
import {
  Badge,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import moment from "moment";
import ReleasePaymentModal from "../../reject_payments/components/ReleasePaymentModal";
import { useReleasePaymentMutation } from "../../../../../../redux/api";

const RequestDetails = ({ data, buddyDetails, refetch, token }) => {
  const {
    id,
    booking_date,
    booking_time,
    booking_price,
    hours,
    location,
    status,
    is_released,
    canceled_status,
    canceled_reason,
    rejected_reason_buddy,
    release_payment_requests,
    created_at,
    updated_at,
    paid_at,
    user,
    category,
    buddy,
  } = data;
  const [modalOpen, setModalOpen] = useState(false);

  const [releasePayment, { isLoading: releasingPayment }] =
    useReleasePaymentMutation();

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleReleaseClick = () => {
    toggleModal();
  };

  const handleConfirmRelease = async (release_to) => {
    try {
      await releasePayment({
        request_id: id,
        buddy_id: buddyDetails.buddyId,
        user_id: user.id,
        release_to,
        token,
      });
      refetch();
      toggleModal();
    } catch (error) {
      console.error("Failed to release payment:", error);
    }
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="my-4">Request Details</h2>
        <Button
          color="primary"
          size="sm"
          className="me-1"
          onClick={() => handleReleaseClick()}
        >
          Release Payment
        </Button>
      </div>
      <Card className="mb-4">
        <CardBody>
          <Row>
            <Col md="6">
              <CardTitle tag="h5">General Information</CardTitle>
              <CardText>
                <strong>Booking Date:</strong>{" "}
                {moment(booking_date).format("MMMM Do YYYY")}
              </CardText>
              <CardText>
                <strong>Booking Time:</strong> {booking_time}
              </CardText>
              <CardText>
                <strong>Booking Price:</strong> ${booking_price}
              </CardText>
              <CardText>
                <strong>Hours:</strong> {hours}
              </CardText>
              <CardText>
                <strong>Location:</strong> {location}
              </CardText>
              <CardText>
                <strong>Status:</strong>{" "}
                <Badge color={status === "PAID" ? "success" : "warning"}>
                  {status}
                </Badge>
              </CardText>
            </Col>
            <Col md="6">
              <CardTitle tag="h5">Status Information</CardTitle>
              <CardText>
                <strong>Release Status:</strong>{" "}
                <Badge color={is_released === false ? "primary" : "success"}>
                  {is_released ? "Released" : "Pending"}
                </Badge>
              </CardText>
              <CardText>
                <strong>Status:</strong>{" "}
                <Badge
                  color={
                    canceled_status === "REJECTED" ? "danger" : "info"
                  }
                >
                  {canceled_status}
                </Badge>
              </CardText>
              <CardText>
                <strong>Canceled Reason:</strong> {canceled_reason}
              </CardText>
              <CardText>
                <strong>Rejected Reason Buddy:</strong> {rejected_reason_buddy}
              </CardText>
              {/* <CardText>
                <strong>Release Payment Requests:</strong>{" "}
                {release_payment_requests}
              </CardText> */}
              <CardText>
                <strong>Created At:</strong>{" "}
                {moment(created_at).format("MMMM Do YYYY, h:mm:ss a")}
              </CardText>
              <CardText>
                <strong>Updated At:</strong>{" "}
                {moment(updated_at).format("MMMM Do YYYY, h:mm:ss a")}
              </CardText>
              <CardText>
                <strong>Paid At:</strong>{" "}
                {paid_at
                  ? moment(paid_at).format("MMMM Do YYYY, h:mm:ss a")
                  : "N/A"}
              </CardText>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <h3 className="my-4">Buddy Details</h3>
      <Card className="mb-4">
        <CardBody>
          <Row>
            <Col md="6">
              <CardTitle tag="h5">User Information</CardTitle>
              <CardText>
                <strong>Full Name:</strong> {buddyDetails?.buddyFullName}
              </CardText>
              {
                <img
                  src={buddyDetails?.buddyImageUrl}
                  alt="User profile"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                />
              }
            </Col>
            <Col md="6">
              <CardTitle tag="h5">User Information</CardTitle>
              <CardText>
                <strong>Full Name:</strong> {user?.full_name}
              </CardText>
              {user.images &&
                user.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.image_url}
                    alt="User profile"
                    style={{
                      width: "100px",
                      height: "100px",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  />
                ))}
            </Col>
          </Row>
        </CardBody>
      </Card>

      <h3 className="my-4">Category Details</h3>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Category Information</CardTitle>
          <CardText>
            <strong>Name:</strong> {category.name}
          </CardText>
          <img
            src={category.image_url}
            alt="Category"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </CardBody>
      </Card>
      <ReleasePaymentModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onConfirm={handleConfirmRelease}
        isLoading={releasingPayment}
      />
    </Container>
  );
};

export default RequestDetails;