'use client'

import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { getCodeString } from 'rehype-rewrite'
import mermaid from 'mermaid'
import katex from 'katex'
import 'katex/dist/katex.css'
import rehypeSanitize from 'rehype-sanitize'
import useTheme from '@/hooks/useTheme'

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
})
const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36)
interface CodeProps {
  inline?: boolean
  children?: React.ReactNode
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any
}
interface MdEditorProps {
  readonly value: string
  readonly onChange: (newValue: string) => void
}

export const Code: React.FC<CodeProps> = ({ children = [], className, node }) => {
  const Mode=useTheme();
  const isDark=(Mode==='dark');
  const demoid = useRef(`dome${randomid()}`)
  const [container, setContainer] = useState<HTMLElement | null>(null)
  
  const isMermaid = className && /^language-mermaid/.test(className.toLowerCase())
  const isKaTeX = className && /^language-katex/.test(className.toLowerCase())
  
  const code = React.useMemo(() => {
    if (node?.children) {
      return getCodeString(node.children)
    }
    if (Array.isArray(children)) {
      return children.filter(child => typeof child === 'string').join('')
    }
    if (typeof children === 'string') {
      return children
    }
    return ''
  }, [node, children])

  useEffect(() => {
    if (container && isMermaid && demoid.current && code) {
      mermaid
        .render(demoid.current, code)
        .then(({ svg, bindFunctions }) => {
          if (container) {
            container.innerHTML = svg
            if (bindFunctions) {
              bindFunctions(container)
            }
          }
        })
        .catch((error) => console.log('Mermaid error:', error))
    }
  }, [container, isMermaid, code])

  const refElement = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setContainer(node)
    }
  }, [])

  if (isMermaid) {
    return (
      <Fragment>
        <code id={demoid.current} style={{ display: 'none' }} />
        <code className={className} ref={refElement} data-name="mermaid" />
      </Fragment>
    )
  }

  if (isKaTeX) {
    const html = katex.renderToString(code, { throwOnError: false })
    return <code dangerouslySetInnerHTML={{ __html: html }} />
  }

  if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
    const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), { throwOnError: false })
    return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent' }} />
  }

  return <code  style={{
    backgroundColor: isDark ? "#0d1117" : "#f5f5f5",
    color: isDark ? "#fff" : "#000",
  }} className={className}>{children}</code>
}

export default function MdEditor({ value, onChange }: MdEditorProps) {
  const Mode=useTheme();let theme;
  if(Mode==='light')  theme="light"
  else theme="dark"
  return (
   <div data-color-mode={theme}>
     <MDEditor
      className="w-full "
      onChange={(newValue = '') => onChange(newValue)}
      textareaProps={{
        
      }}
      height={350}
      value={value}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
        components: {
          code: Code
        },
      }}
    />
   </div>
  )
}