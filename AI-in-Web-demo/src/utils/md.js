import markdownit from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/scss/default.scss";

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const preCode = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
        const normalizedCode = preCode.replace(/\n$/, "");
        const lines = normalizedCode.split("\n");
        const codeHeader = `
					<div class="code-header">
						<div class="code-header-left">
							<div class="code-language">${lang ? lang : ""}</div>
						</div>
						<div class="code-header-right code-copy">复制代码</div>
					</div>
				`;
        const codeContent = lines
          .map((item, index) => {
            return `<div class="code-line" data-line=${
              index + 1
            }>${item}</div>`;
          })
          .join("");
        return `<pre>${codeHeader}<code class="hljs">${codeContent}</code></pre>`;
        // eslint-disable-next-line
      } catch (__) {}
    }
    return (
      '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
});

export default md;
