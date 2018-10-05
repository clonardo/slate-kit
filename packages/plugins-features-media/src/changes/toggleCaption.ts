import { Change, Block, Text } from "slate";
import { TypeOption } from "../options";

export default function toggleCaption(opts: TypeOption, utils) {
  const { type, captionType, mediaTypes, captionHideField } = opts;
  return (change: Change, node?: Block) => {
    const media = node
      ? utils.getClosestMediaContainer(change.value.document, node)
      : utils.getSelectedMediaBlock(change.value);

    if (media && Block.isBlock(media)) {
      const caption = media.findDescendant(
        n => Block.isBlock(n) && n.type === captionType
      );
      if (caption && Block.isBlock(caption)) {
        if (captionHideField) {
          change.setNodeByKey(caption.key, {
            data: caption.data.set(
              captionHideField,
              !caption.data.get(captionHideField)
            )
          });
        } else {
          change.removeNodeByKey(caption.key);
        }
      } else {
        const captionBlock = Block.create({
          type: captionType,
          nodes: [Text.create("")]
        });
        change.insertNodeByKey(media.key, media.nodes.size + 1, captionBlock);
      }
    }
    return change;
  };
}