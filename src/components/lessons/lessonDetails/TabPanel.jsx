import React from 'react'
import { Box } from '@mui/material'

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lesson-tabpanel-${index}`}
      aria-labelledby={`lesson-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default TabPanel
