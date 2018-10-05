import classnames from "classnames";
import { toggleCheck } from "../changes";

export default function createProps(opts, pluginsWrapper) {
  const { blockTypes, startAtField, checkField } = opts;
  const { orderedlist, unorderedlist, checklist } = blockTypes;
  const listTypes = [orderedlist, unorderedlist, checklist];
  return {
    getProps: nodeProps => {
      const { getIndentationLevel } = pluginsWrapper.getUtils("indent");
      if (!nodeProps.node || !listTypes.includes(nodeProps.node.type)) {
        return nodeProps;
      }
      const { editor, key, node } = nodeProps;
      const {
        props: {
          value: { document }
        }
      } = editor;
      const previousBlock = document.getPreviousBlock(key);
      const prevIndentation =
        previousBlock && getIndentationLevel(previousBlock);
      const indentation = getIndentationLevel(nodeProps.node);
      const startAt = nodeProps.node.data.get(startAtField);
      const checked = nodeProps.node.data.get(checkField);
      const style =
        nodeProps.attributes && nodeProps.attributes.style
          ? nodeProps.attributes.style
          : {};
      if (startAt) {
        style["--start-at"] = startAt;
      }
      const shouldReset =
        !previousBlock ||
        (previousBlock && previousBlock.type !== node.type) ||
        prevIndentation < indentation ||
        startAt;
      const onMouseDown =
        nodeProps.node.type === checklist
          ? e => {
              const { top } = e.target.getBoundingClientRect();
              let left;
              if (e.target.children && e.target.children[0]) {
                const {
                  left: leftBound
                } = e.target.children[0].getBoundingClientRect();
                left = leftBound;
              }
              const targetStyle = getComputedStyle(e.target);
              const fontSize = parseInt(targetStyle.fontSize || "16px", 10);
              if (
                !(
                  left &&
                  e.clientX >= left - 2 * fontSize &&
                  e.clientX <= left &&
                  e.clientY >= top + fontSize * 0.3 &&
                  e.clientY <= top + fontSize * 1.3 &&
                  e.target.nodeName.toLowerCase() === "li"
                )
              ) {
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              if (
                nodeProps.editor.props.isReadOnly ||
                !toggleCheck ||
                nodeProps.editor.props.readOnly
              ) {
                return;
              }
              const {
                state: { value: stateValue },
                props: { onChange, value }
              } = nodeProps.editor;
              onChange(
                toggleCheck(
                  opts,
                  stateValue ? stateValue.change() : value.change(),
                  node
                )
              );
            }
          : () => {};
      const className = classnames({
        [nodeProps.className]: nodeProps.className,
        "list-reset": shouldReset,
        [`list-reset-${indentation}`]: indentation && shouldReset,
        checked: !!checked,
        checkList: nodeProps.node.type === checklist,
        readOnly:
          nodeProps.node.type === checklist && nodeProps.editor.props.isReadOnly
      });
      return {
        ...nodeProps,
        className,
        onMouseDown,
        attributes: {
          ...nodeProps.attributes,
          style
        }
      };
    }
  };
}