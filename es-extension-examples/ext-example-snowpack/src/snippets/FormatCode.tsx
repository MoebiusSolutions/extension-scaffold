import React from 'react'
import Prism from 'prismjs';
import 'prism-themes/themes/prism-a11y-dark.css'

export const FormatCode: React.FC<{source: string}> = ({source}) => {
  const html = Prism.highlight(source, Prism.languages.javascript, 'javascript');

  return <pre dangerouslySetInnerHTML={{__html: html}} />
}
