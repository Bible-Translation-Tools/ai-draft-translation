import {ThemeProvider, createTheme} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {useState} from "react";
import {Switch, FormControlLabel, Box, Typography, Paper} from "@mui/material";
import TranslatePage from "./pages/TranslatePage";
import BatchTranslatePage from "./pages/BatchTranslatePage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const [isBatchMode, setIsBatchMode] = useState(false);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBatchMode(event.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{position: "fixed", top: 16, right: 16, zIndex: 1000}}>
        <Paper
          elevation={3}
          sx={{
            p: 1,
            borderRadius: "25px",
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            <Typography
              variant="body1"
              sx={{
                color: isBatchMode ? "#666" : "#1976d2",
                fontWeight: isBatchMode ? "normal" : "bold",
                transition: "all 0.3s ease",
              }}
            >
              Single
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isBatchMode}
                  onChange={handleSwitchChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#1976d2",
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#1976d2",
                      },
                    },
                    "& .MuiSwitch-switchBase": {
                      color: "#ccc",
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#e0e0e0",
                      },
                    },
                  }}
                />
              }
              label=""
              sx={{margin: 0}}
            />
            <Typography
              variant="body1"
              sx={{
                color: isBatchMode ? "#1976d2" : "#666",
                fontWeight: isBatchMode ? "bold" : "normal",
                transition: "all 0.3s ease",
              }}
            >
              Batch
            </Typography>
          </Box>
        </Paper>
      </Box>

      {!isBatchMode && <TranslatePage />}
      {isBatchMode && <BatchTranslatePage />}
    </ThemeProvider>
  );
}

export default App;
