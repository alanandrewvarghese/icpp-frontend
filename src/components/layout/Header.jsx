import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CodeIcon from '@mui/icons-material/Code'

const Header = ({ toggleTheme, darkMode, navLinks }) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null) // For mobile menu
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null) // For desktop dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // State to control desktop dropdown open/close

  const handleMobileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDropdownOpen = (event) => {
    setDropdownAnchorEl(event.currentTarget)
    setIsDropdownOpen(true) // Open dropdown on hover
  }

  const handleDropdownClose = () => {
    setIsDropdownOpen(false) // Close dropdown
  }

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 1 }}>
            <CodeIcon color="primary" />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: 0.5,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PyInteract
          </Typography>
        </Box>

        {/* Desktop Navigation with Dropdown */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          {navLinks.map((link, index) => (
            <Box key={index} onMouseLeave={handleDropdownClose}>
              {' '}
              {/* Added onMouseLeave to the Box wrapper */}
              {link.subLinks ? (
                <>
                  <Button
                    color="inherit"
                    onMouseEnter={handleDropdownOpen}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                  >
                    {link.text}
                  </Button>
                  <Menu
                    anchorEl={dropdownAnchorEl}
                    open={isDropdownOpen}
                    onClose={handleDropdownClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Keep anchor at bottom
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }} // Keep transform at top, for now
                    MenuListProps={{
                      onMouseLeave: handleDropdownClose,
                    }}
                    PaperProps={{
                      // Add PaperProps to style the dropdown's paper container
                      style: {
                        marginTop: 5, // Add some margin at the top to push it down
                      },
                    }}
                  >
                    {link.subLinks.map((subLink, subIndex) => (
                      <MenuItem
                        key={subIndex}
                        onClick={handleDropdownClose}
                        component="a"
                        href={subLink.url}
                      >
                        {subLink.text}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Button color="inherit" href={link.url}>
                  {link.text}
                </Button>
              )}
            </Box>
          ))}
        </Box>

        {/* Mobile Navigation Button */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton color="inherit" aria-label="menu" onClick={handleMobileMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMobileMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {navLinks.map((link, index) => (
            <Box key={index}>
              <MenuItem disabled={!!link.subLinks}>{link.text}</MenuItem>
              {link.subLinks &&
                link.subLinks.map((subLink, subIndex) => (
                  <MenuItem
                    key={subIndex}
                    onClick={handleMobileMenuClose}
                    component="a"
                    href={subLink.url}
                    sx={{ pl: 4 }}
                  >
                    {subLink.text}
                  </MenuItem>
                ))}
            </Box>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
