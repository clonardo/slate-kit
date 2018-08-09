// @flow
import type { Change } from "slate";
import { Data } from "slate";
import { isKeyHotkey } from "is-hotkey";
import hotkeys from "slate-hotkeys";
import { type typeOptions } from "../options";
import { resetStartAt, unwrapList } from "../changes";
import { isListNode } from "../utils";

export default function createOnKeyDown(
  opts: typeOptions,
  pluginsWrapper: any
) {
  const { startAtField, checkField } = opts;
  const isTab = isKeyHotkey("tab");
  const isShiftTab = isKeyHotkey("shift+tab");
  const isEnter = isKeyHotkey("enter");
  const isShiftEnter = isKeyHotkey("shift+enter");
  const {
    isDeleteCharBackward,
    isDeleteLineBackward,
    isDeleteWordBackward
  } = hotkeys;
  const isDelete = e =>
    isDeleteCharBackward(e) ||
    isDeleteLineBackward(e) ||
    isDeleteWordBackward(e);

  return (e: SyntheticKeyboardEvent<*>, change: Change) => {
    const { value } = change;
    const { startBlock, endBlock, selection } = value;
    const { isCollapsed, startOffset } = selection;
    const isIndent = isTab(e) && !isShiftTab(e);
    const isSplitBlock =
      isEnter(e) && !isShiftEnter(e) && isListNode(opts, startBlock);
    const isDeleting = isDelete(e);
    const isOutdent =
      isShiftTab(e) ||
      (isDeleting &&
        startBlock === endBlock &&
        isCollapsed &&
        startOffset === 0);
    if (!(isIndent || isSplitBlock || isOutdent)) return undefined;
    if (isIndent) {
      e.preventDefault();
      e.stopPropagation();
      resetStartAt(opts, change);
      return undefined;
    } else if (isSplitBlock) {
      const { text, data, key } = startBlock;
      if (startBlock === endBlock && isCollapsed && text === "") {
        e.preventDefault();
        e.stopPropagation();
        unwrapList(opts, change, true, pluginsWrapper);
        return true;
      } else if (startBlock === endBlock && startOffset === text.length) {
        change.insertBlock({
          type: startBlock.type,
          data: data.delete(startAtField).delete(checkField)
        });
        return true;
      } else if (startBlock === endBlock && startOffset === 0) {
        const startAt = data.get(startAtField);
        const checked = data.get(checkField);
        change
          .setNodeByKey(key, {
            data: data.delete(startAtField).delete(checkField)
          })
          .splitBlock(1)
          .setNodeByKey(key, {
            data: Data.create({
              [startAtField]: startAt,
              [checkField]: checked
            })
          });
        return true;
      }
      return undefined;
    }
    if (isListNode(opts, startBlock)) {
      e.preventDefault();
      e.stopPropagation();
      unwrapList(opts, change, isDeleting, pluginsWrapper);
      return true;
    }
    return undefined;
  };
}
