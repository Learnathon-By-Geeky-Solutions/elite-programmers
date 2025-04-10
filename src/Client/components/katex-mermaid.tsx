'use client'

import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import mermaid from 'mermaid'
import katex from 'katex'
import 'katex/dist/katex.css'
import rehypeSanitize from 'rehype-sanitize'

const mdMixed = `
This is to display the KaTeX in one line:
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`

And here's a Mermaid diagram:

\`\`\`mermaid
graph TD
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
\`\`\`
`

const randomid = () => {
  const array = new Uint32Array(10)
  window.crypto.getRandomValues(array)
  return Array.from(array)
    .map((n) => n.toString(36))
    .join('')
    .substring(0, 15)
}

interface CodeProps {
  children?: React.ReactNode
  className?: string
}

const Code: React.FC<CodeProps> = ({ children = [], className = '' }) => {
  const demoid = useRef(`dome${randomid()}`)
  const [container, setContainer] = useState<HTMLElement | null>(null)
  let code = ''
  if (Array.isArray(children)) {
    code = children.map((child) => (typeof child === 'string' ? child : '')).join('')
  } else if (typeof children === 'string') {
    code = children
  }

  useEffect(() => {
    if (container && code) {
      const isMermaid = className?.toLowerCase().startsWith('language-mermaid')
      const isKaTeX = className?.toLowerCase().startsWith('language-katex')
      if (isMermaid) {
        mermaid
          .render(demoid.current, code)
          .then(({ svg, bindFunctions }) => {
            container.innerHTML = svg
            if (bindFunctions) {
              bindFunctions(container)
            }
          })
          .catch((error) => console.log('mermaid error:', error))
      } else if (isKaTeX) {
        const html = katex.renderToString(code, { throwOnError: false })
        container.innerHTML = html
      }
    }
  }, [container, className, code])

  const refElement = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setContainer(node)
    }
  }, [])

  if (className?.toLowerCase().startsWith('language-mermaid')) {
    return (
      <Fragment>
        <code id={demoid.current} style={{ display: 'none' }} />
        <code className={className} ref={refElement} data-name="mermaid" />
      </Fragment>
    )
  }

  if ( className?.toLowerCase().startsWith('language-katex')) {
    return <code className={className} ref={refElement} />
  }

  if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
    const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), { throwOnError: false })
    return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent' }} />
  }

  return <code className={className}>{children}</code>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MarkdownCode = (props: any) => <Code {...props} />
/**
 * Renders a Markdown editor with live preview and enhanced code block rendering.
 *
 * This component utilizes the MDEditor to provide a rich Markdown editing experience. It initializes with default Markdown content and updates its state as the user edits the text. The editor is configured with a fixed height, an input placeholder, and preview options that include HTML sanitization via rehypeSanitize and custom code rendering through the MarkdownCode component for displaying diagrams and mathematical expressions.
 *
 * @returns A React element representing the configured Markdown editor.
 */
export default function MdEditor() {
  const [value, setValue] = useState(mdMixed)
  return (
    <MDEditor
      className="w-full"
      onChange={(newValue = '') => setValue(newValue)}
      textareaProps={{
        placeholder: 'Please enter Markdown text',
      }}
      height={500}
      value={value}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
        components: {
          code: MarkdownCode
        },
      }}
    />
  )
}
