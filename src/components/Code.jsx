import React, { useState, useEffect } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import copy from 'copy-to-clipboard'
import { FaRegClipboard, FaCheck } from 'react-icons/fa'

const Code = ({ children, language }) => {
  const [isCopied, setIsCopied] = useState(false)

  let content
  if (Array.isArray(children.props.children)) {
    content = children.props.children.join('\n')
  } else {
    content = children.props.children
  }

  const handleCopy = () => {
    copy(content)
    setIsCopied(true)
  }

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false)
      }, 3000) // Reset after 3 seconds

      return () => clearTimeout(timeout) // Clean up on unmount
    }
  }, [isCopied])

  return (
    <div style={{ position: 'relative' }}>
      <Highlight
        {...defaultProps}
        code={content.trim()}
        language={language}
        theme={theme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <>
            <button
              style={{
                position: 'absolute',
                right: '1em',
                top: tokens.length === 1 ? '50%' : '0.5em',
                transform: tokens.length === 1 ? 'translateY(-50%)' : 'none',
                zIndex: 10,
                border: '1px solid #ccc',
                borderRadius: '15%',
                padding: '5px',
                backgroundColor: 'transparent',
              }}
              onClick={handleCopy}
            >
              {isCopied ? (
                <FaCheck style={{ color: 'green' }} />
              ) : (
                <FaRegClipboard style={{ color: 'white' }} />
              )}
            </button>
            <pre className={`${className} prism-code`} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })} key={i}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} key={key} />
                  ))}
                </div>
              ))}
            </pre>
          </>
        )}
      </Highlight>
    </div>
  )
}

export default Code
