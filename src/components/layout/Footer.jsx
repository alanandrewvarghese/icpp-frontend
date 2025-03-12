import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ backgroundColor: 'grey.50', borderTop: '1px solid grey.200' }}>
      <Container maxWidth="xl" sx={{ py: 3, px: 4, sm: { px: 6 }, lg: { px: 8 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Stack direction="row" spacing={2} sx={{ order: { md: 2 } }}>
            <Link
              href="#"
              color="grey.500"
              underline="hover"
              sx={{ '&:hover': { color: 'blue.500' } }}
            >
              Terms
            </Link>
            <Link
              href="#"
              color="grey.500"
              underline="hover"
              sx={{ '&:hover': { color: 'blue.500' } }}
            >
              Privacy
            </Link>
            <Link
              href="#"
              color="grey.500"
              underline="hover"
              sx={{ '&:hover': { color: 'blue.500' } }}
            >
              Cookies
            </Link>
          </Stack>
          <Typography
            variant="body1"
            color="grey.500"
            sx={{ mt: { xs: 2, md: 0 }, order: { md: 1 }, textAlign: { xs: 'center', md: 'left' } }}
          >
            © {currentYear} PyInteract. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
