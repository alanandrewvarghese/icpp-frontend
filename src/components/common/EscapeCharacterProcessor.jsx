import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material'

/**
 * A component that processes escape characters in real-time as the user types
 * @param {Object} props - Component props
 * @param {string} props.initialValue - Initial content value
 * @param {function} props.onChange - Callback when content changes
 * @param {string} props.label - Label for the text field
 * @param {number} props.rows - Number of rows for the text field
 */
const EscapeCharacterProcessor = ({
  initialValue = '',
  onChange,
  label = 'Content (Markdown Format)',
  rows = 10,
  error = false,
  helperText = '',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(initialValue)

  // Initialize with initial value
  useEffect(() => {
    setInputValue(initialValue)
  }, [initialValue])

  const handleChange = (e) => {
    const newValue = e.target.value

    // Process escape sequences as they're typed
    let processedValue = newValue

    // Don't process if we're dealing with a backslash that was just typed
    const endsWithSingleBackslash = /[^\\]\\$|^\\$/.test(newValue)

    if (!endsWithSingleBackslash) {
      // Replace escape sequences
      processedValue = newValue
        // Convert \\n to actual newlines
        .replace(/\\n/g, '\n')
        // Convert \\t to actual tabs
        .replace(/\\t/g, '\t')
        // Replace markdown escape sequences
        .replace(/\\([`*_{}[\]()#+\-.!~|>'"])/g, '$1')
    }

    // Update internal state
    setInputValue(processedValue)

    // Notify parent
    if (onChange) {
      onChange(processedValue)
    }
  }

  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      multiline
      rows={rows}
      value={inputValue}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      disabled={disabled}
      InputProps={{
        sx: {
          fontFamily: 'monospace',
        },
      }}
    />
  )
}

export default EscapeCharacterProcessor
