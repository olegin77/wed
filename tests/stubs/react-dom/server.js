const React = require("../react");

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function render(node) {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return escapeHtml(node);
  }
  if (Array.isArray(node)) {
    return node.map(render).join("");
  }
  if (node && typeof node.type === "function") {
    const props = { ...(node.props || {}) };
    if (node.children.length === 1) {
      props.children = node.children[0];
    } else if (node.children.length > 1) {
      props.children = node.children;
    }
    const rendered = node.type(props);
    return render(rendered);
  }
  if (node && node.type === React.Fragment) {
    return render(node.children);
  }
  return renderElement(node);
}

function renderElement(node) {
  const type = node.type;
  const props = node.props || {};
  let html = `<${type}`;
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || key === "dangerouslySetInnerHTML") {
      continue;
    }
    if (value === false || value === null || value === undefined) {
      continue;
    }
    if (typeof value === "function") {
      continue;
    }
    if (key === "key") {
      continue;
    }
    const attrName = key === "className" ? "class" : key === "htmlFor" ? "for" : key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    let attrValue = value === true ? "" : value;
    if (key === "style" && value && typeof value === "object") {
      const styles = [];
      for (const [styleKey, styleValue] of Object.entries(value)) {
        const kebab = styleKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        styles.push(`${kebab}:${styleValue}`);
      }
      attrValue = styles.join(";");
    }
    if (attrValue === "") {
      html += ` ${attrName}`;
    } else {
      html += ` ${attrName}="${escapeHtml(attrValue)}"`;
    }
  }

  if (VOID_ELEMENTS.has(type)) {
    return `${html} />`;
  }

  let childrenHtml = "";
  if (props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html != null) {
    childrenHtml = props.dangerouslySetInnerHTML.__html;
  } else {
    childrenHtml = render(node.children);
  }

  return `${html}>${childrenHtml}</${type}>`;
}

function renderToStaticMarkup(element) {
  return render(element);
}

module.exports = { renderToStaticMarkup };
module.exports.default = { renderToStaticMarkup };
