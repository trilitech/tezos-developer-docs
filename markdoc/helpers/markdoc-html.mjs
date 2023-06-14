import Markdoc from "@markdoc/markdoc";
import { Parser } from "htmlparser2";

const config = {
  tags: {
    foo: { render: "foo" },
    bar: { render: "bar" },
    "html-tag": {
      attributes: {
        name: { type: String, required: true },
        attrs: { type: Object },
      },
      transform(node, config) {
        const { name, attrs } = node.attributes;
        const children = node.transformChildren(config);
        return new Markdoc.Tag(name, attrs, children);
      },
    },
  },
};

function processTokens(tokens) {
  const output = [];

  const parser = new Parser({
    onopentag(name, attrs) {
      output.push({
        type: "tag_open",
        nesting: 1,
        meta: {
          tag: "html-tag",
          attributes: [
            { type: "attribute", name: "name", value: name },
            { type: "attribute", name: "attrs", value: attrs },
          ],
        },
      });
    },

    ontext(content) {
      if (typeof content === "string" && content.trim().length > 0)
        output.push({ type: "text", content });
    },

    onclosetag(name) {
      output.push({
        type: "tag_close",
        nesting: -1,
        meta: { tag: "html-tag" },
      });
    },
  });

  for (const token of tokens) {
    if (token.type.startsWith("html")) {
      parser.write(token.content);
      continue;
    }

    if (token.type === "inline")
      token.children = processTokens(token.children);

    output.push(token);
  }

  return output;
}

const example = `
# This is a <em class="asdf">test</em>

{% foo %}

<div class="example">

This is a Markdown paragraph with **formatting** inside of an HTML element.

{% bar %}

<div class="inner">
<p>This is a <strong>test</strong></p>

Inner content <em>with markup</em> and [markup inside a <strong>link</strong>](/example).

</div>

{% /bar %}

</div>

{% /foo %}
`;

const tokenizer = new Markdoc.Tokenizer({ html: true });
const tokens = tokenizer.tokenize(example);
const processed = processTokens(tokens);
const doc = Markdoc.parse(processed);
const transformed = Markdoc.transform(doc, config);
const output = Markdoc.renderers.html(transformed);

console.log(output);