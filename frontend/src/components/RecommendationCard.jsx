import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
  Button,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

function RecommendationCard({
  recommendation,
  onReview,
  loading,
}) {
  const getStatusColor = () => {
    switch (recommendation.status) {
      case "COMPLETED":
      case "REVIEWED":
      case "APPROVED":
        return "success";

      case "PENDING":
        return "warning";

      case "REJECTED":
      case "FAILED":
        return "error";

      default:
        return "default";
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        backgroundColor: "background.paper",
        transition: "all 0.25s ease",
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
            "linear-gradient(135deg, rgba(25,118,210,0.1), rgba(25,118,210,0.02))",
        }}
        avatar={
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <AutoAwesomeOutlinedIcon />
          </Box>
        }
        title={
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              wordBreak: "break-word",
            }}
          >
            {recommendation.recommendationId}
          </Typography>
        }
        action={
          <Chip
            label={recommendation.status}
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

      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Stack spacing={2.2} sx={{ flex: 1 }}>
          <RecommendationInfo
            icon={<Inventory2OutlinedIcon fontSize="small" />}
            label="Product"
            value={recommendation.productId}
          />

          <RecommendationInfo
            icon={<LocationOnOutlinedIcon fontSize="small" />}
            label="Node"
            value={recommendation.nodeId}
          />

          <RecommendationInfo
            icon={<LocalShippingOutlinedIcon fontSize="small" />}
            label="Supplier"
            value={recommendation.supplierId}
          />

          <RecommendationInfo
            icon={<NumbersOutlinedIcon fontSize="small" />}
            label="Recommended Quantity"
            value={recommendation.recommendedQuantity}
          />

          <Divider />

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <PsychologyOutlinedIcon
                fontSize="small"
                color="primary"
              />

              <Typography variant="subtitle2" fontWeight={700}>
                Reason
              </Typography>
            </Stack>

            <Box
              sx={{
                p: 1.8,
                borderRadius: 2,
                backgroundColor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {recommendation.reason}
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AutoAwesomeOutlinedIcon />}
          onClick={() =>
            onReview(recommendation.recommendationId)
          }
          disabled={loading}
          sx={{
            mt: 3,
            py: 1.2,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Reviewing..." : "Review with AI"}
        </Button>
      </CardContent>
    </Card>
  );
}

function RecommendationInfo({ icon, label, value }) {
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
          width: 34,
          height: 34,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

export default RecommendationCard;