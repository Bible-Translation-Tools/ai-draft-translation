import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container, Typography } from "@mui/material";

import TranslatePage from "./pages/TranslatePage";
import BatchTranslatePage from "./pages/BatchTranslatePage";
import ModeToggle from "./components/ModeToggle";

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
  const [isBatchMode, setIsBatchMode] = useState(true);

  const handleModeChange = (isBatch: boolean) => {
    setIsBatchMode(isBatch);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container disableGutters sx={{ paddingTop: '50px' }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 0 }}>
            {isBatchMode ? "Document Translation Tool" : "Text Translation Tool"}
          </Typography>
          <ModeToggle isBatchMode={isBatchMode} onChange={handleModeChange} />
        </Box>
      </Container>

      {!isBatchMode && <TranslatePage />}
      {isBatchMode && <BatchTranslatePage />}
    </ThemeProvider>
  );
}

export default App;
