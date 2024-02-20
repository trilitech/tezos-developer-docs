// Taken from https://gitlab.com/nomadic-labs-free-resources/opentezos/-/blob/main/src/theme/prism-archetype.js?ref_type=heads

(function (Prism) {

	Prism.languages.archetype = {
		'comment': /\(\*[\s\S]*?\*\)/,
		'string': [
			{
				pattern: /"(?:\\.|[^\\\r\n"])*"/,
				greedy: true
			},
			{
				pattern: /(['`])(?:\\(?:\d+|x[\da-f]+|.)|(?!\1)[^\\\r\n])\1/i,
				greedy: true
			}
		],
		'number': /\b(?:0x[\da-f][\da-f_]+|(?:0[bo])?\d[\d_]*%\.?[\d_]*(?:e[+-]?[\d_]+)?)/i,
		'label': {
			pattern: /\B~\w+/,
			alias: 'function'
		},
		'type_variable': {
			pattern: /\w+\s+:\s+\w+/,
			alias: 'inserted'
		},
		// For the list of keywords and operators,
		// see: http://caml.inria.fr/pub/docs/manual-ocaml/lex.html#sec84
		'keyword': /\b(?:constant|const|archetype|enum|states|variable|event|asset|entry|transition|function|getter|var|let some|specification|postcondition|record|invariant)\b/,
		'constant': /\b(?:as|require|failif|called|by|shadow|state|is|effect|initial|identified by|initialized by|assert|begin|end|do|done|else|otherwise|exec_lambda|return|before|for|if|in|match|in|forall|added|removed|exists|struct|then|the|from|to|while|with|when|fails|operations|now|caller|transferred|transfer|emit|source|InvalidCondition|InvalidCaller|NotFound|NatAssign|SliceError|DivByZero|OutOfBound)\b/,
		'boolean': /\b(?:false|true)\b/,
		// Custom operators are allowed
		'function': /:=|\+=|\-=|[=<>@^|&+\-*\/$%!?~][!$%&*+\-.\/:<=>?@^|~]*|\b(?:and|not|asr|land|lor|lsl|lsr|lxor|mod|count|removeif|or|left|right|remove|update|abs|unpack|none|clear|open_chest|opt_get|select|sort|head|nth|add|put|addupdate|dofailif|dorequire|sum|update_all|fail|some|isempty|length|balance|selfaddress|min|max|contains)\b/,
		'punctuation': /[(){}\[\]|.,:;]|\b_\b/
	};
}(Prism));
