import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";

function AgentResult({ result }) {
  if (!result) {
    return null;
  }

  const action = result.action || {};

  const getDecisionColor = () => {
    switch (result.decision) {
      case "APPROVE":
      case "APPROVED":
        return "success";

      case "REJECT":
      case "REJECTED":
        return "error";

      case "REVIEW":
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
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
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
          <SmartToyOutlinedIcon />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" fontWeight={700}>
            Latest Agent Review
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Automated purchasing recommendation and validation
          </Typography>
        </Box>

        <Chip
          label={result.decision || "N/A"}
          color={getDecisionColor()}
          size="small"
          sx={{
            fontWeight: 700,
            borderRadius: 1.5,
          }}
        />
      </Box>

      <Divider />

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <ResultInfo
              icon={<Inventory2OutlinedIcon fontSize="small" />}
              label="Recommended Quantity"
              value={result.recommendedQuantity ?? "N/A"}
            />

            <ResultInfo
              icon={<LocalShippingOutlinedIcon fontSize="small" />}
              label="Supplier"
              value={result.supplierId ?? "N/A"}
            />

            <ResultInfo
              icon={<CurrencyRupeeOutlinedIcon fontSize="small" />}
              label="Unit Price"
              value={
                result.unitPrice !== undefined
                  ? `₹${result.unitPrice}`
                  : "N/A"
              }
            />

            <ResultInfo
              icon={<PlayArrowOutlinedIcon fontSize="small" />}
              label="Action"
              value={action.type || "NONE"}
            />
          </Box>

          <Divider />

          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <PsychologyOutlinedIcon
                fontSize="small"
                color="primary"
              />

              <Typography variant="subtitle2" fontWeight={700}>
                Reasoning
              </Typography>
            </Stack>

            <Box
              sx={{
                p: 2,
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
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {result.reasoning || "No reasoning provided"}
              </Typography>
            </Box>
          </Box>

          {result.validation && (
            <>
              <Divider />

              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  mb={1.5}
                >
                  {result.validation.valid ? (
                    <CheckCircleOutlineIcon color="success" />
                  ) : (
                    <ErrorOutlineIcon color="error" />
                  )}

                  <Typography variant="subtitle2" fontWeight={700}>
                    Validation
                  </Typography>

                  <Chip
                    label={result.validation.valid ? "Passed" : "Failed"}
                    color={result.validation.valid ? "success" : "error"}
                    size="small"
                    sx={{
                      ml: "auto",
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                {result.validation.valid ? (
                  <Alert
                    severity="success"
                    icon={<CheckCircleOutlineIcon />}
                    sx={{
                      borderRadius: 2,
                      alignItems: "center",
                    }}
                  >
                    Validation passed successfully.
                  </Alert>
                ) : (
                  <Alert
                    severity="error"
                    icon={<ErrorOutlineIcon />}
                    sx={{
                      borderRadius: 2,
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Validation failed. Please review the errors below.
                    </Typography>
                  </Alert>
                )}

                {result.validation.errors?.length > 0 && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "error.main",
                      background:
                        "linear-gradient(135deg, rgba(211,47,47,0.08), rgba(211,47,47,0.02))",
                      border: "1px solid",
                      borderColor: "error.light",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="error.main"
                      fontWeight={700}
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Errors
                    </Typography>

                    <List dense disablePadding sx={{ mt: 0.5 }}>
                      {result.validation.errors.map((error) => (
                        <ListItem
                          key={error}
                          disableGutters
                          sx={{ alignItems: "flex-start" }}
                        >
                          <ListItemIcon sx={{ minWidth: 28, mt: 0.3 }}>
                            <ErrorOutlineIcon
                              fontSize="small"
                              color="error"
                            />
                          </ListItemIcon>

                          <ListItemText
                            primary={error}
                            primaryTypographyProps={{
                              variant: "body2",
                              color: "text.primary",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {result.validation.warnings?.length > 0 && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, rgba(237,108,2,0.08), rgba(237,108,2,0.02))",
                      border: "1px solid",
                      borderColor: "warning.light",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="warning.dark"
                      fontWeight={700}
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Warnings
                    </Typography>

                    <List dense disablePadding sx={{ mt: 0.5 }}>
                      {result.validation.warnings.map((warning) => (
                        <ListItem
                          key={warning}
                          disableGutters
                          sx={{ alignItems: "flex-start" }}
                        >
                          <ListItemIcon sx={{ minWidth: 28, mt: 0.3 }}>
                            <WarningAmberOutlinedIcon
                              fontSize="small"
                              color="warning"
                            />
                          </ListItemIcon>

                          <ListItemText
                            primary={warning}
                            primaryTypographyProps={{
                              variant: "body2",
                              color: "text.primary",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ResultInfo({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        minWidth: 0,
        p: 1.5,
        borderRadius: 2,
        backgroundColor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
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
          backgroundColor: "background.paper",
          color: "primary.main",
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
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
          fontWeight={700}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default AgentResult;