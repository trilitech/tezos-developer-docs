import 'prismjs'

import React, { useState, useEffect, useRef } from 'react'
import copy from 'copy-to-clipboard'
import { FaRegClipboard, FaCheck } from 'react-icons/fa'

export function CodeBlock({ children, language }) {
  const [isCopied, setIsCopied] = useState(false)
  const ref = useRef(null)

  const excludedLanguages = ['sh', 'shell', 'text']

  useEffect(() => {
    if (ref.current) Prism.highlightElement(ref.current, false)
  }, [children])

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false)
      }, 3000) // Reset after 3 seconds

      return () => clearTimeout(timeout) // Clean up on unmount
    }
  }, [isCopied])

  const handleCopy = () => {
    copy(children)
    setIsCopied(true)
  }

  return (
    <div className="code" aria-live="polite">
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: '#353540', // change to desired grey color
          padding: '8px 5px',
          marginTop: '1em',
          marginBottom: '0',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
      >
        {!excludedLanguages.includes(language) && (
          <button
            style={{
              backgroundColor: 'transparent',
              marginRight: '0.5em',
            }}
            onClick={handleCopy}
          >
            {isCopied ? (
              <FaCheck style={{ color: 'green' }} />
            ) : (
              <FaRegClipboard style={{ color: 'white' }} />
            )}
          </button>
        )}
      </div>
      <pre
        ref={ref}
        className={`language-${language}`}
        style={{ padding: '1em' }}
      >
        {children}
      </pre>

      <style jsx>
        {`
          .code {
            position: relative;
          }

          /* Override Prism styles */
          .code :global(pre[class*='language-']) {
            text-shadow: none;
            border-radius: 0px;
            bordertopleftradius: 0;
            bordertoprightradius: 0;
            margin-top: 0;
            border: none !important;
          }
        `}
      </style>
    </div>
  )
}
