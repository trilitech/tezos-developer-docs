// Test resources for imageCheck.mjs

/*
Generated this AST from this file:
---
title: hi
---

import Figure from '@site/src/components/Figure';

<Figure src="/img/abcde.svg" caption="figure with broken image link" />

<img src="/img/fghij.png" alt="Entering information for the new RPC node" style={{width: 300}} />

![UI for Better Call Dev](/img/qwerty.png)
*/

export const expectedImagesInAst = [
  "/img/abcde.svg",
  "/img/fghij.png",
  "/img/qwerty.png",
];

export const exampleAstWithBrokenLinks = {
  type: "root",
  children: [
    {
      type: "thematicBreak",
      position: {
        start: {
          line: 1,
          column: 1,
          offset: 0,
        },
        end: {
          line: 1,
          column: 4,
          offset: 3,
        },
      },
    },
    {
      type: "heading",
      depth: 2,
      children: [
        {
          type: "text",
          value: "title: hi",
          position: {
            start: {
              line: 2,
              column: 1,
              offset: 4,
            },
            end: {
              line: 2,
              column: 10,
              offset: 13,
            },
          },
        },
      ],
      position: {
        start: {
          line: 2,
          column: 1,
          offset: 4,
        },
        end: {
          line: 3,
          column: 4,
          offset: 17,
        },
      },
    },
    {
      type: "mdxjsEsm",
      value: "import Figure from '@site/src/components/Figure';",
      position: {
        start: {
          line: 5,
          column: 1,
          offset: 19,
        },
        end: {
          line: 5,
          column: 50,
          offset: 68,
        },
      },
      data: {
        estree: {
          type: "Program",
          start: 19,
          end: 68,
          loc: {
            start: {
              line: 5,
              column: 0,
              offset: 19,
            },
            end: {
              line: 5,
              column: 49,
              offset: 68,
            },
          },
          body: [
            {
              type: "ImportDeclaration",
              start: 19,
              end: 68,
              loc: {
                start: {
                  line: 5,
                  column: 0,
                  offset: 19,
                },
                end: {
                  line: 5,
                  column: 49,
                  offset: 68,
                },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 26,
                  end: 32,
                  loc: {
                    start: {
                      line: 5,
                      column: 7,
                      offset: 26,
                    },
                    end: {
                      line: 5,
                      column: 13,
                      offset: 32,
                    },
                  },
                  local: {
                    type: "Identifier",
                    start: 26,
                    end: 32,
                    loc: {
                      start: {
                        line: 5,
                        column: 7,
                        offset: 26,
                      },
                      end: {
                        line: 5,
                        column: 13,
                        offset: 32,
                      },
                    },
                    name: "Figure",
                    range: [
                      26,
                      32,
                    ],
                  },
                  range: [
                    26,
                    32,
                  ],
                },
              ],
              source: {
                type: "Literal",
                start: 38,
                end: 67,
                loc: {
                  start: {
                    line: 5,
                    column: 19,
                    offset: 38,
                  },
                  end: {
                    line: 5,
                    column: 48,
                    offset: 67,
                  },
                },
                value: "@site/src/components/Figure",
                raw: "'@site/src/components/Figure'",
                range: [
                  38,
                  67,
                ],
              },
              range: [
                19,
                68,
              ],
            },
          ],
          sourceType: "module",
          comments: [
          ],
          range: [
            19,
            68,
          ],
        },
      },
    },
    {
      type: "mdxJsxFlowElement",
      name: "Figure",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "src",
          value: "/img/abcde.svg",
        },
        {
          type: "mdxJsxAttribute",
          name: "caption",
          value: "figure with broken image link",
        },
      ],
      children: [
      ],
      position: {
        start: {
          line: 7,
          column: 1,
          offset: 70,
        },
        end: {
          line: 7,
          column: 72,
          offset: 141,
        },
      },
    },
    {
      type: "mdxJsxFlowElement",
      name: "img",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "src",
          value: "/img/fghij.png",
        },
        {
          type: "mdxJsxAttribute",
          name: "alt",
          value: "Entering information for the new RPC node",
        },
        {
          type: "mdxJsxAttribute",
          name: "style",
          value: {
            type: "mdxJsxAttributeValueExpression",
            value: "{width: 300}",
            data: {
              estree: {
                type: "Program",
                start: 224,
                end: 236,
                body: [
                  {
                    type: "ExpressionStatement",
                    expression: {
                      type: "ObjectExpression",
                      start: 224,
                      end: 236,
                      loc: {
                        start: {
                          line: 9,
                          column: 81,
                          offset: 224,
                        },
                        end: {
                          line: 9,
                          column: 93,
                          offset: 236,
                        },
                      },
                      properties: [
                        {
                          type: "Property",
                          start: 225,
                          end: 235,
                          loc: {
                            start: {
                              line: 9,
                              column: 82,
                              offset: 225,
                            },
                            end: {
                              line: 9,
                              column: 92,
                              offset: 235,
                            },
                          },
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: "Identifier",
                            start: 225,
                            end: 230,
                            loc: {
                              start: {
                                line: 9,
                                column: 82,
                                offset: 225,
                              },
                              end: {
                                line: 9,
                                column: 87,
                                offset: 230,
                              },
                            },
                            name: "width",
                            range: [
                              225,
                              230,
                            ],
                          },
                          value: {
                            type: "Literal",
                            start: 232,
                            end: 235,
                            loc: {
                              start: {
                                line: 9,
                                column: 89,
                                offset: 232,
                              },
                              end: {
                                line: 9,
                                column: 92,
                                offset: 235,
                              },
                            },
                            value: 300,
                            raw: "300",
                            range: [
                              232,
                              235,
                            ],
                          },
                          kind: "init",
                          range: [
                            225,
                            235,
                          ],
                        },
                      ],
                      range: [
                        224,
                        236,
                      ],
                    },
                    start: 224,
                    end: 236,
                    loc: {
                      start: {
                        line: 9,
                        column: 81,
                        offset: 224,
                      },
                      end: {
                        line: 9,
                        column: 93,
                        offset: 236,
                      },
                    },
                    range: [
                      224,
                      236,
                    ],
                  },
                ],
                sourceType: "module",
                comments: [
                ],
                loc: {
                  start: {
                    line: 9,
                    column: 81,
                    offset: 224,
                  },
                  end: {
                    line: 9,
                    column: 93,
                    offset: 236,
                  },
                },
                range: [
                  224,
                  236,
                ],
              },
            },
          },
        },
      ],
      children: [
      ],
      position: {
        start: {
          line: 9,
          column: 1,
          offset: 143,
        },
        end: {
          line: 9,
          column: 98,
          offset: 240,
        },
      },
    },
    {
      type: "paragraph",
      children: [
        {
          type: "image",
          title: null,
          url: "/img/qwerty.png",
          alt: "UI for Better Call Dev",
          position: {
            start: {
              line: 11,
              column: 1,
              offset: 242,
            },
            end: {
              line: 11,
              column: 43,
              offset: 284,
            },
          },
        },
      ],
      position: {
        start: {
          line: 11,
          column: 1,
          offset: 242,
        },
        end: {
          line: 11,
          column: 43,
          offset: 284,
        },
      },
    },
  ],
  position: {
    start: {
      line: 1,
      column: 1,
      offset: 0,
    },
    end: {
      line: 11,
      column: 43,
      offset: 284,
    },
  },
};
