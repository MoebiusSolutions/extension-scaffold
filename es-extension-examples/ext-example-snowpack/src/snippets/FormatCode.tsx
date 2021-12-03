import React from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import a11yDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'

SyntaxHighlighter.registerLanguage('typescript', typescript)

export const FormatCode: React.FC<{source: string}> = ({source}) => {
  return <SyntaxHighlighter language="typescript" style={a11yDark}>
    {source}
  </SyntaxHighlighter>
}
