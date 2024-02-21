(function (Prism) {

  Prism.languages.cameligo = Prism.languages.extend('ocaml', {
    // Taken from https://gitlab.com/ligolang/ligo/-/blob/bbd039025ab6dbd9747c67630d2752fabab9aeaa/gitlab-pages/website/src/theme/CodeBlock/index.tsx#L28
    'comment': [
      /(^|[^\\])\/\*[\s\S]*?\*\//,
      /\(\*[\s\S]*?\*\)/,
      /\/\/.*/
    ]
  });
}(Prism));