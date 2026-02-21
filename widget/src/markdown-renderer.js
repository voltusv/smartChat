import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "del", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "a", "code", "pre", "blockquote", "table", "thead",
  "tbody", "tr", "th", "td", "hr", "img", "span",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class"];

/**
 * Parse markdown string to sanitized HTML.
 * @param {string} markdown - Raw markdown text
 * @returns {string} Sanitized HTML string
 */
export function renderMarkdown(markdown) {
  if (!markdown) return "";
  const rawHtml = marked.parse(markdown);
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
