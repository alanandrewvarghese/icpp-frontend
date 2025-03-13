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
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  Divider,
  Container,
  Tooltip,
  alpha,
} from '@mui/material'
import CodeIcon from '@mui/icons-material/Code'
import MenuIcon from '@mui/icons-material/Menu'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Link as RouterLink } from 'react-router-dom'

const Header = ({ navLinks }) => {
  const theme = useTheme()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})
  const [anchorEls, setAnchorEls] = useState({})

  // Toggle mobile drawer
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  // Handle dropdown menu for desktop
  const handleMenuOpen = (index, event) => {
    setAnchorEls((prev) => ({
      ...prev,
      [index]: event.currentTarget,
    }))
  }

  const handleMenuClose = (index) => {
    setAnchorEls((prev) => ({
      ...prev,
      [index]: null,
    }))
  }

  // Toggle expanded items in mobile drawer
  const toggleExpanded = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Render desktop navigation
  const renderDesktopNav = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, ml: 'auto' }}>
      {navLinks.map((link, index) => (
        <Box key={index} sx={{ position: 'relative' }}>
          {link.subLinks ? (
            <>
              <Tooltip>
                <Button
                  aria-controls={`menu-${index}`}
                  aria-haspopup="true"
                  onClick={(e) => handleMenuOpen(index, e)}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    color: theme.palette.primary.dark,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  {link.text}
                </Button>
              </Tooltip>
              <Menu
                id={`menu-${index}`}
                anchorEl={anchorEls[index]}
                open={Boolean(anchorEls[index])}
                onClose={() => handleMenuClose(index)}
                MenuListProps={{
                  'aria-labelledby': `button-${index}`,
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    borderRadius: 0.5,
                    minWidth: 180,
                    overflow: 'visible',
                    '&:before': {
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      left: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                {link.subLinks.map((subLink, subIndex) => (
                  <MenuItem
                    key={subIndex}
                    component={RouterLink}
                    to={subLink.url}
                    onClick={() => handleMenuClose(index)}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      py: 1,
                      color: theme.palette.primary.main,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <Typography variant="body2">{subLink.text}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button
              component={RouterLink}
              to={link.url}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: 500,
                color: theme.palette.primary.dark,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {link.text}
            </Button>
          )}
        </Box>
      ))}
    </Box>
  )

  // Render mobile drawer content
  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      PaperProps={{
        sx: {
          width: '80%',
          maxWidth: 300,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        },
      }}
    >
      <Box sx={{ py: 2, px: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            mb: 1,
          }}
        >
          <CodeIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PyInteract
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List component="nav" sx={{ width: '100%' }}>
          {navLinks.map((link, index) => (
            <React.Fragment key={index}>
              {link.subLinks ? (
                <>
                  <ListItemButton onClick={() => toggleExpanded(index)}>
                    <ListItemText
                      primary={link.text}
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                    {expandedItems[index] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={expandedItems[index]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {link.subLinks.map((subLink, subIndex) => (
                        <ListItemButton
                          key={subIndex}
                          component={RouterLink}
                          to={subLink.url}
                          onClick={toggleMobileDrawer}
                          sx={{ pl: 4 }}
                        >
                          <ListItemText
                            primary={subLink.text}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItemButton component={RouterLink} to={link.url} onClick={toggleMobileDrawer}>
                  <ListItemText
                    primary={link.text}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItemButton>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  )

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo and Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 2 },
              textDecoration: 'none',
            }}
          >
            <CodeIcon
              color="primary"
              sx={{
                mr: 1,
                fontSize: { xs: 28, md: 32 },
                transition: 'transform 0.2s',
                '&:hover': { transform: 'rotate(10deg)' },
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.5,
                background: theme.palette.primary.dark,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PyInteract
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {renderDesktopNav()}

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
            <IconButton
              size="large"
              color="primary"
              aria-label="open menu"
              onClick={toggleMobileDrawer}
              sx={{
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
                p: 1,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Drawer */}
          {renderMobileDrawer()}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
