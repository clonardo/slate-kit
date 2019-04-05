import { Editor } from "slate";
import { TypeOption } from "../options";

export default function getSelectedMediaBlock(opts: TypeOption) {
  const { mediaTypes, type, captionType } = opts;
  const mediaTypesOpts = Object.values(mediaTypes).reduce(
    (types, mediaOption) => [...types, mediaOption.type],
    [captionType]
  );
  return (editor: Editor) => {
    const { value } = editor;
    const { document } = value;
    const selectedBlocks = editor.getHighestSelectedBlocks();
    if (selectedBlocks.size !== 1) return undefined;
    const block = selectedBlocks.get(0);
    if (block && block.type === type) return block;
    if (block && mediaTypesOpts.includes(block.type)) {
      return document.getParent(document.getPath(block.key));
    }
    return undefined;
  };
}
