import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";

import TranslatePage from "./pages/TranslatePage";
import BatchTranslatePage from "./pages/BatchTranslatePage";
import RecentJobsPage from "./pages/RecentJobsPage";
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
  const [currentPage, setCurrentPage] = useState<'batch' | 'translate' | 'recent'>('batch');

  const handleModeChange = (isBatch: boolean) => {
    setCurrentPage(isBatch ? 'batch' : 'translate');
  };

  const handleShowRecentJobs = () => {
    setCurrentPage('recent');
  };

  const handleBackToBatch = () => {
    setCurrentPage('batch');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* <Container disableGutters sx={{ paddingTop: '50px' }}>
        {currentPage !== 'recent' && (
          <ModeToggle isBatchMode={currentPage === 'batch'} onChange={handleModeChange} />
        )}
      </Container> */}

      {currentPage === 'translate' && <TranslatePage />}
      {currentPage === 'batch' && <BatchTranslatePage onShowRecentJobs={handleShowRecentJobs} />}
      {currentPage === 'recent' && <RecentJobsPage onBack={handleBackToBatch} />}
    </ThemeProvider>
  );
}

export default App;
