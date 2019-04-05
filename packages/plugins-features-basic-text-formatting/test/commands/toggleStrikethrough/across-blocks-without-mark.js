/** @jsx h */
import h from "@vericus/slate-kit-utils-hyperscript";

export default function(editor) {
  editor.toggleStrikethrough();
}

export const input = (
  <value>
    <document>
      <h1>
        wo
        <anchor />
        rd
      </h1>
      <h1>
        an
        <focus />
        other
      </h1>
    </document>
  </value>
);

export const output = (
  <value>
    <document>
      <h1>
        wo
        <anchor />
        <s>rd</s>
      </h1>
      <h1>
        <s>an</s>
        <focus />
        other
      </h1>
    </document>
  </value>
);
