import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

interface ConfirmationModalProps {
  open: boolean;
  handleClose: () => void;
  method: string;
  handleConfirmation: (confirmed: boolean) => void; // Callback to handle confirmation
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};
const buttonStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 2,
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  handleClose,
  method,
  handleConfirmation,
}) => {
  const handleConfirm = () => {
    // Perform API request or any other logic here
    // For example, fetch(apiUrl, { method: 'DELETE' }) and handle response
    // For now, assume confirmation is received immediately
    handleConfirmation(true); // Pass true for confirmation
    handleClose(); // Close the modal
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to {method} this permission ?
        </Typography>

        <Box sx={buttonStyle}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
