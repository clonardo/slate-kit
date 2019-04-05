import { Record } from "immutable";

export type TypographyTypes =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "heading-four"
  | "blockquote";

export type BlockTypes = { [key in TypographyTypes]?: string | null };

export interface TypeOptions {
  renderer?: (...args: any[]) => any;
  blockTypes: BlockTypes;
  defaultBlock: string;
  label: string;
}

const defaultOptions: Partial<TypeOptions> = {
  blockTypes: {
    paragraph: "paragraph",
    "heading-one": "heading-one",
    "heading-two": "heading-two",
    "heading-three": "heading-three",
    "heading-four": "heading-four",
    blockquote: "blockquote"
  },
  defaultBlock: "paragraph",
  renderer: undefined,
  label: "basic-typography"
};

class Options extends Record(defaultOptions, "Typhography Options") {
  public blockTypes: BlockTypes;

  public defaultBlock: string;

  public renderer: (...args: any[]) => any;

  public label: string;

  public static create(option: Partial<TypeOptions>): TypeOptions {
    const options = {
      ...defaultOptions,
      ...option,
      blockTypes: {
        ...defaultOptions.blockTypes,
        ...(option.blockTypes ? option.blockTypes : {})
      }
    };
    return new Options(options);
  }
}

export default Options;
