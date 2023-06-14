import React from 'react'
import { InlineMath, BlockMath } from 'react-katex'

const Math = ({ inline, children }) => {
  const mathString = children.props
    ? String(children.props.children)
    : String(children)

  if (inline) {
    return <InlineMath math={mathString} />
  } else {
    return <BlockMath math={mathString} />
  }
}

export default Math
