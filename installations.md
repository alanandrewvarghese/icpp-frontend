# Code Formatting [Prettier]
```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

# Utility Functions JS
```bash
npm install lodash-es
```

# Jest Testing
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

# React Router
```bash
npm install react-router-dom
```

# Axios
```bash
npm install axios
```

# Material UI
```bash
npm install @mui/material@5.16.14 @emotion/react@latest @emotion/styled@latest
```

# MUI Icons
```bash
npm install @mui/icons-material@5.16.14
```

# Roboto Font for MUI
```bash
npm install @fontsource/roboto
```

# Tailwind CSS
```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

# Monaco Editor
```bash
npm install @monaco-editor/react@next
```

## Sample Code
```javascript
import Editor from '@monaco-editor/react';

function CodeEditor() {
  return (
      <Editor
        height="500px" // Set the desired height of the editor
        defaultLanguage="python" // Set the default language
        defaultValue="# MonacoEditor"
        theme="vs-dark" // Optional: Choose a theme (vs-dark, light, etc.)
        onChange={(value, event) => {
          console.log('Editor value changed:', value);
        }}
      />
  );
}

export default CodeEditor;
```