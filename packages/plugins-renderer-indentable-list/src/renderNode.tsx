import * as React from "react";
import SlateTypes from "slate-prop-types";
import { Node } from "slate";

export interface Props {
  attributes: any;
  children: JSX.Element;
  className: string;
  onMouseDown?: () => {};
  node: Node;
}

const OrderedList: React.SFC<Props> = props => {
  const { attributes, children, className } = props;
  return (
    <ol {...attributes} className={className}>
      <li>{children}</li>
    </ol>
  );
};

const UnOrderedList: React.SFC<Props> = props => {
  const { attributes, children, className } = props;
  return (
    <ul {...attributes} className={className}>
      <li>{children}</li>
    </ul>
  );
};

const CheckList: React.SFC<Props> = props => {
  const { attributes, children, onMouseDown, className } = props;
  return (
    <ul {...attributes} className={className}>
      <li onMouseDown={onMouseDown}>{children}</li>
    </ul>
  );
};

OrderedList.propTypes = SlateTypes.Block;
UnOrderedList.propTypes = SlateTypes.Block;
CheckList.propTypes = SlateTypes.Block;

export function createRenderNode() {
  return {
    nodes: {
      orderedlist: OrderedList,
      unorderedlist: UnOrderedList,
      checklist: CheckList
    }
  };
}

export { createRenderNode as default, OrderedList, UnOrderedList, CheckList };