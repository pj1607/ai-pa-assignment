import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

function PurchaseOrderTable({ purchaseOrders }) {
  if (!purchaseOrders.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "background.paper",
        }}
      >
        <Avatar
          sx={{
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2,
            backgroundColor: "action.hover",
            color: "text.secondary",
          }}
        >
          <ReceiptLongOutlinedIcon />
        </Avatar>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          No Purchase Orders Yet
        </Typography>

        <Typography variant="body2" color="text.secondary">
          No purchase orders have been created yet.
        </Typography>
      </Paper>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
      case "REJECTED":
        return "error";
      case "APPROVED":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.1), rgba(25,118,210,0.02))",
        }}
      >
        <Avatar
          sx={{
            width: 42,
            height: 42,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <ReceiptLongOutlinedIcon />
        </Avatar>

        <Box>
          <Typography variant="h6" fontWeight={700}>
            Purchase Orders
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Track created purchase orders and their current status
          </Typography>
        </Box>
      </Box>

      <TableContainer
        sx={{
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 4,
          },
        }}
      >
        <Table
          sx={{
            minWidth: 850,
            "& .MuiTableCell-root": {
              borderColor: "divider",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "action.hover",
              }}
            >
              <TableCell>
                <HeaderCell
                  icon={<ReceiptLongOutlinedIcon />}
                  label="PO Number"
                />
              </TableCell>

              <TableCell>
                <HeaderCell
                  icon={<Inventory2OutlinedIcon />}
                  label="Product"
                />
              </TableCell>

              <TableCell>
                <HeaderCell
                  icon={<LocationOnOutlinedIcon />}
                  label="Node"
                />
              </TableCell>

              <TableCell>
                <HeaderCell
                  icon={<LocalShippingOutlinedIcon />}
                  label="Supplier"
                />
              </TableCell>

              <TableCell align="right">
                <HeaderCell
                  icon={<NumbersOutlinedIcon />}
                  label="Quantity"
                />
              </TableCell>

              <TableCell align="right">
                <HeaderCell
                  icon={<CurrencyRupeeOutlinedIcon />}
                  label="Total Cost"
                />
              </TableCell>

              <TableCell align="center">
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  textTransform="uppercase"
                  letterSpacing={0.5}
                >
                  Status
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {purchaseOrders.map((purchaseOrder) => (
              <TableRow
                key={purchaseOrder.poNumber}
                hover
                sx={{
                  transition: "background-color 0.2s ease",
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {purchaseOrder.poNumber}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {purchaseOrder.productId}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {purchaseOrder.nodeId}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {purchaseOrder.supplierId}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {purchaseOrder.quantity}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="success.main"
                  >
                    ₹{purchaseOrder.totalCost}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={purchaseOrder.status}
                    color={getStatusColor(purchaseOrder.status)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 1.5,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function HeaderCell({ icon, label }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.8}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "primary.main",
          "& svg": {
            fontSize: 17,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        textTransform="uppercase"
        letterSpacing={0.5}
        whiteSpace="nowrap"
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default PurchaseOrderTable;