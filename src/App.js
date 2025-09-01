import { Routes, Route } from "react-router"
import { CssBaseline, ThemeProvider, createTheme, Box, AppBar, Toolbar, Typography } from "@mui/material"
import JobsIndex from "./pages/JobsIndex"
import Candidates from "./pages/Candidates"
import Sidebar from "./components/Sidebar"

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6">
              Recruiter Console
            </Typography>
          </Toolbar>
        </AppBar>
        <Sidebar />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<JobsIndex />} />
            <Route path="/jobs" element={<JobsIndex />} />
            <Route path="/candidates" element={<Candidates />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
