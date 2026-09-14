import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
  Box,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

function ActionCard({
  action,
  onApprove,
  onReject,
  onExecute,
  loading,
}) {
  const proposedAction = action.proposedAction || {};

  const getStatusColor = () => {
    switch (action.approvalStatus) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor: "background.paper",
        transition: "all 0.25s ease",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          borderColor: "primary.main",
        },
      }}
    >
      <CardHeader
        sx={{
          px: 3,
          py: 2.5,
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(25,118,210,0.02))",
        }}
        title={
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            sx={{
              wordBreak: "break-word",
            }}
          >
            {action.actionId}
          </Typography>
        }
        action={
          <Chip
            label={action.approvalStatus}
            color={getStatusColor()}
            size="small"
            sx={{
              fontWeight: 700,
              borderRadius: 1.5,
            }}
          />
        }
      />

      <Divider />

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.2}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing={0.6}
            >
              Recommendation
            </Typography>

            <Typography variant="body2" fontWeight={600} mt={0.5}>
              {action.recommendationId || "N/A"}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing={0.6}
            >
              Action Type
            </Typography>

            <Typography variant="body2" fontWeight={600} mt={0.5}>
              {action.actionType}
            </Typography>
          </Box>

          <Divider />

          <Stack spacing={1.8}>
            <InfoRow
              icon={<Inventory2OutlinedIcon fontSize="small" />}
              label="Product"
              value={proposedAction.productId}
            />

            <InfoRow
              icon={<LocationOnOutlinedIcon fontSize="small" />}
              label="Node"
              value={proposedAction.nodeId}
            />

            <InfoRow
              icon={<LocalShippingOutlinedIcon fontSize="small" />}
              label="Supplier"
              value={proposedAction.supplierId}
            />

            <InfoRow
              icon={<NumbersOutlinedIcon fontSize="small" />}
              label="Quantity"
              value={proposedAction.quantity}
            />

            <InfoRow
              icon={<CurrencyRupeeOutlinedIcon fontSize="small" />}
              label="Unit Price"
              value={`₹${proposedAction.unitPrice}`}
            />
          </Stack>

          {(action.approvalStatus === "PENDING" ||
            (action.approvalStatus === "APPROVED" &&
              action.status !== "COMPLETED")) && <Divider />}

          {action.approvalStatus === "PENDING" && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 0.5 }}
            >
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={() => onApprove(action.actionId)}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Approve
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<CancelOutlinedIcon />}
                onClick={() => onReject(action.actionId)}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Reject
              </Button>
            </Stack>
          )}

          {action.approvalStatus === "APPROVED" &&
            action.status !== "COMPLETED" && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<PlayArrowOutlinedIcon />}
                onClick={() => onExecute(action.actionId)}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Execute PO
              </Button>
            )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: 1.5,
          backgroundColor: "action.hover",
          color: "primary.main",
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          display="block"
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value ?? "N/A"}
        </Typography>
      </Box>
    </Stack>
  );
}

export default ActionCard;