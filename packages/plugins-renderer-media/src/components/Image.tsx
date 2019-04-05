import * as React from "react";
import { Block } from "slate";
import { Props as GenericProps } from "../types";
import ImageUploader from "./ImageUploader";

interface States {
  src: string;
  width: string;
  error?: Error;
}

interface Props extends GenericProps {
  extensions: string;
  onInsert: (...args: any[]) => any;
}

export default class Image extends React.Component<Props, States> {
  private constructor(props) {
    super(props);
    const { editor } = this.props;
    this.state = {
      src: Block.isBlock(this.props.node)
        ? editor.getSource(this.props.node)
        : "",
      width: Block.isBlock(this.props.node)
        ? editor.getImageWidth(this.props.node)
        : ""
    };
  }

  public static getDerivedStateFromProps(props, state) {
    const { editor, node } = props;
    const width = editor.getImageWidth(node);
    const src = editor.getSource(node);
    if (width !== state.width || src !== state.src) {
      return {
        ...state,
        width,
        src
      };
    }
    return null;
  }

  private onImageSelected = src => {
    const { node, editor } = this.props;
    if (Block.isBlock(node)) {
      editor.updateImageSource(node, src).toggleCaption(node);
    }
  };

  public render() {
    const {
      className,
      attributes,
      isSelected,
      extensions,
      onInsert
    } = this.props;
    const { src, width } = this.state;
    if (!src || src === "") {
      return (
        <ImageUploader
          className={className || ""}
          onChange={this.onImageSelected}
          extensions={extensions}
          onInsert={onInsert}
          width={width}
          isSelected={isSelected}
          src={src}
        />
      );
    }
    return (
      <img
        className={className}
        src={src}
        alt={src}
        data-image-width={width}
        data-image-is-selected={isSelected}
        {...attributes}
      />
    );
  }
}
