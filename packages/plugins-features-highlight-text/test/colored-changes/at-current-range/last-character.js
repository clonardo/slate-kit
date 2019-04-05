/** @jsx h */
import h from "@vericus/slate-kit-utils-hyperscript";

export default function(editor, name) {
  editor[`change${name}Color`]("red");
}

export const input = (
  <value>
    <document>
      <paragraph>
        wor
        <anchor />d<focus />
      </paragraph>
    </document>
  </value>
);

export const output = (
  <value>
    <document>
      <paragraph>
        wor
        <anchor />
        <color color="red">d</color>
        <focus />
      </paragraph>
    </document>
  </value>
);
