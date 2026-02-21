/**
 * Convert HTML from the contenteditable editor to markdown.
 * Handles: bold, italic, underline, lists, code, headings, links.
 */
export function htmlToMarkdown(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return nodeToMarkdown(temp).trim();
}

function nodeToMarkdown(node) {
  let result = "";

  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase();
      const inner = nodeToMarkdown(child);

      switch (tag) {
        case "strong":
        case "b":
          result += `**${inner}**`;
          break;
        case "em":
        case "i":
          result += `*${inner}*`;
          break;
        case "u":
          result += `__${inner}__`;
          break;
        case "code":
          result += `\`${inner}\``;
          break;
        case "pre":
          result += `\n\`\`\`\n${child.textContent}\n\`\`\`\n`;
          break;
        case "a":
          result += `[${inner}](${child.getAttribute("href") || ""})`;
          break;
        case "h1": case "h2": case "h3": case "h4": case "h5": case "h6": {
          const level = parseInt(tag[1]);
          result += `\n${"#".repeat(level)} ${inner}\n`;
          break;
        }
        case "ul":
          result += "\n" + convertList(child, "ul") + "\n";
          break;
        case "ol":
          result += "\n" + convertList(child, "ol") + "\n";
          break;
        case "li":
          result += inner;
          break;
        case "br":
          result += "\n";
          break;
        case "div":
        case "p":
          result += `\n${inner}\n`;
          break;
        default:
          result += inner;
      }
    }
  }
  return result;
}

function convertList(listNode, type) {
  let result = "";
  let index = 1;
  for (const li of listNode.children) {
    if (li.tagName.toLowerCase() === "li") {
      const prefix = type === "ol" ? `${index++}. ` : "- ";
      result += prefix + nodeToMarkdown(li).trim() + "\n";
    }
  }
  return result;
}
