import { Editor } from "slate";
import { isKeyHotkey } from "is-hotkey";
import hotkeys from "slate-hotkeys";
import { TypeOptions } from "../options";

export default function createOnKeyDown(opts: TypeOptions) {
  const { startAtField, checkField } = opts;
  const isTab = isKeyHotkey("tab");
  const isShiftTab = isKeyHotkey("shift+tab");
  const isEnter = isKeyHotkey("enter");
  const isShiftEnter = isKeyHotkey("shift+enter");
  const {
    isDeleteBackward,
    isDeleteLineBackward,
    isDeleteWordBackward
  } = hotkeys;
  const isDelete = e =>
    isDeleteBackward(e) || isDeleteLineBackward(e) || isDeleteWordBackward(e);

  return (e, editor: Editor, next) => {
    const { value } = editor;
    const { startBlock, endBlock, selection } = value;
    const {
      isCollapsed,
      start: { offset: startOffset }
    } = selection;
    const isIndent = isTab(e) && !isShiftTab(e);
    const isSplitBlock =
      isEnter(e) && !isShiftEnter(e) && editor.isListNode(startBlock);
    const isDeleting = isDelete(e);
    const isOutdent =
      isShiftTab(e) ||
      (isDeleting &&
        startBlock === endBlock &&
        isCollapsed &&
        startOffset === 0);
    if (!(isIndent || isSplitBlock || isOutdent)) return next();
    if (isIndent) {
      e.preventDefault();
      e.stopPropagation();
      editor.resetStartAt();
      return next();
    }
    if (isSplitBlock) {
      const { text, data, key } = startBlock;
      if (startBlock === endBlock && isCollapsed && text === "") {
        e.preventDefault();
        e.stopPropagation();
        editor.unwrapList(true);
        return undefined;
      }
      if (startBlock === endBlock && startOffset === text.length) {
        editor.insertBlock({
          type: startBlock.type,
          data: data.delete(startAtField).delete(checkField)
        });
        return undefined;
      }
      if (startBlock === endBlock) {
        editor.setNodeByKey(key, {
          data: data.delete(startAtField).delete(checkField)
        });
        if (startOffset !== 0) {
          editor.splitBlock(1);
          editor.setNodeByKey(key, {
            data
          });
        } else {
          editor.insertBlock({
            type: startBlock.type,
            data: data.delete(checkField)
          });
          editor.setNodeByKey(key, {
            data: data.delete(startAtField)
          });
        }
        return undefined;
      }
      return next();
    }
    if (editor.isListNode(startBlock)) {
      e.preventDefault();
      e.stopPropagation();
      editor.unwrapList(isDeleting);
      return undefined;
    }
    return next();
  };
}
