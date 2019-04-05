/** @jsx h */
import h from "@vericus/slate-kit-utils-hyperscript";

export default function(editor) {
  editor.toggleUnderline();
}

export const input = (
  <value>
    <document>
      <h1>
        wo
        <cursor />
        rd
      </h1>
      <h1>another</h1>
    </document>
  </value>
);

export const output = (
  <value>
    <document>
      <h1>
        wo
        <cursor marks={[{ type: "underline" }]} />
        rd
      </h1>
      <h1>another</h1>
    </document>
  </value>
);
