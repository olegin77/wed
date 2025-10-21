const Fragment = Symbol.for("react.fragment");

function normalizeChildren(children) {
  const flat = [];
  for (const child of children) {
    if (Array.isArray(child)) {
      flat.push(...normalizeChildren(child));
    } else {
      flat.push(child);
    }
  }
  return flat;
}

function createElement(type, props, ...children) {
  const normalizedProps = props ? { ...props } : {};
  const flatChildren = normalizeChildren(children);
  if (flatChildren.length === 1) {
    normalizedProps.children = flatChildren[0];
  } else if (flatChildren.length > 1) {
    normalizedProps.children = flatChildren;
  }
  return { type, props: normalizedProps, children: flatChildren };
}

function noop() {}

function useState(initial) {
  return [typeof initial === "function" ? initial() : initial, noop];
}

function useEffect() {}
function useMemo(factory) {
  return factory();
}
function useRef(initial) {
  return { current: initial }; 
}

const React = {
  createElement,
  Fragment,
  useState,
  useEffect,
  useMemo,
  useRef,
};

module.exports = React;
module.exports.default = React;
module.exports.createElement = createElement;
module.exports.Fragment = Fragment;
module.exports.useState = useState;
module.exports.useEffect = useEffect;
module.exports.useMemo = useMemo;
module.exports.useRef = useRef;
