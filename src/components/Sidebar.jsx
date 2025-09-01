import { useLocation, NavLink } from 'react-router-dom'
import { Drawer, Toolbar, Box, List, ListItemButton, ListItemText } from "@mui/material"

function Sidebar() {
  const location = useLocation();
  const drawerWidth = 240
  return (
    <Drawer variant="permanent"
    sx={{
      width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" }
    }}>
      <Toolbar />
      <Box sx={{ overflow: "auto"}}>
        <List>
          <ListItemButton component={NavLink} to="/jobs" style={({ isActive }) => ({
            backgroundColor: isActive? "#e0e7ff" : "transparent"
          })}>
            <ListItemText primary="Jobs" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/candidates" style={({ isActive }) => ({
            backgroundColor: isActive? "#e0e7ff" : "transparent"
          })}>
            <ListItemText primary="Fake Candidates" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar
