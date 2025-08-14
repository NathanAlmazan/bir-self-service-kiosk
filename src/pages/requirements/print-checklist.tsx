import * as React from "react";

import Dialog from "@mui/material/Dialog";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import QRCode from "react-qr-code";
import { SxProps, Theme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: SxProps<Theme>;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props;

  return (
    <Box
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type UserAgreementProps = {
  open: boolean;
  handleClose: () => void;
  checklistUrl: string;
};

export default function PrintChecklistDialog({
  open,
  handleClose,
  checklistUrl,
}: UserAgreementProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <Box sx={{ width: "100%" }}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Checklist of Requirements
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Preview" {...a11yProps(0)} />
            <Tab label="Download" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} sx={{ height: "calc(100vh - 120px)", padding: 0 }}>
          <iframe
            src={checklistUrl}
            title="PDF Preview"
            width="100%"
            height="100%"
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              my: 3
            }}
          >
            <Typography variant="h6" component="div" align="center" sx={{ mb: 3 }}>
              Please scan the QR code to download the checklist.
            </Typography>
            <QRCode size={256} value={checklistUrl} />
          </Box>
        </CustomTabPanel>
      </Box>
    </Dialog>
  );
}
