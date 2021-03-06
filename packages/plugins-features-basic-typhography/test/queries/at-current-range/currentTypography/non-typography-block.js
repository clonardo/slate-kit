/** @jsx h */
import h from "@vericus/slate-kit-utils-hyperscript";

export default function(editor) {
  return editor.currentTypography();
}

export const input = (
  <value>
    <document>
      <ol>
        <anchor />
        word
        <focus />
      </ol>
    </document>
  </value>
);

export const output = "paragraph";
