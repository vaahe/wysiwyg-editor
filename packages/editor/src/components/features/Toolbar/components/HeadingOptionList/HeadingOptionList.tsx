import type { FC } from "react";
import { HeadingOptionItem } from "../HeadingOptionItem";
import type { HeadingOption, HeadingValue } from "../HeadingDropdown";

type Props = {
  options: HeadingOption[];
  onSelect: (value: HeadingValue) => void;
};

export const HeadingOptionList: FC<Props> = ({ options, onSelect }) => {
  return (
    <div id={"heading_option_list"}>
      {options.map((option) => (
        <HeadingOptionItem key={option.value} option={option} onSelect={onSelect} />
      ))}
    </div>
  );
};
