/** @jsx h */
import h from "@vericus/slate-kit-utils-hyperscript";

export default function(editor) {
  return editor.canBeIndented();
}

export const input = (
  <value>
    <document>
      <quote>
        <anchor />
        <b>word</b>
      </quote>
      <quote>
        <focus />
        <b>word</b>
      </quote>
    </document>
  </value>
);

export const output = false;
