import type { FC, MouseEvent } from "react";
import type { HeadingOption, HeadingValue } from "../HeadingDropdown";

type Props = {
  option: HeadingOption;
  onSelect: (value: HeadingValue) => void;
};

export const HeadingOptionItem: FC<Props> = ({ option, onSelect }) => {
  const Tag = option.value === "p" ? "p" : option.value;
  console.log(Tag);
  const handleClick = () => onSelect(option.value);
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div onMouseDown={handleMouseDown} onClick={handleClick} className={"vb-heading-option-item"}>
      <Tag style={{ margin: 0 }}>{option.label}</Tag>
    </div>
  );
};
