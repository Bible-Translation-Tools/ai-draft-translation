import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import BatchTranslatePage from "./pages/BatchTranslatePage";
import RecentJobsPage from "./pages/RecentJobsPage";

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
  const [currentPage, setCurrentPage] = useState<'batch' | 'recent'>('batch');

  const handleShowRecentJobs = () => {
    setCurrentPage('recent');
  };

  const handleBackToBatch = () => {
    setCurrentPage('batch');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentPage === 'batch' && <BatchTranslatePage onShowRecentJobs={handleShowRecentJobs} />}
      {currentPage === 'recent' && <RecentJobsPage onBack={handleBackToBatch} />}
    </ThemeProvider>
  );
}

export default App;
