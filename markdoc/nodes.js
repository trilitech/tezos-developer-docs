import { nodes as defaultNodes } from '@markdoc/markdoc'

import { CodeBlock } from '@/components/Fence'

const nodes = {
  document: {
    render: undefined,
  },
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  fence: {
    render: CodeBlock,
    attributes: {
      content: {type: String},
      language: {
        type: String,
        default: 'javascript',
        description:
          'The programming language of the code block. Place it after the backticks.',
      },
    },
  }

}

export default nodes
