import classnames from "classnames";

export default function createProps(opts) {
  const { indentable } = opts;
  return props => {
    const { node, editor } = props;
    if (!node || !indentable.includes(node.type)) return props;
    const indentLevel = editor.getIndentationLevel(node);
    const className = classnames({
      [props.className]: props.className,
      [`indentation-${indentLevel + 1}`]: indentLevel,
      indented: indentLevel
    });
    return {
      ...props,
      className
    };
  };
}
