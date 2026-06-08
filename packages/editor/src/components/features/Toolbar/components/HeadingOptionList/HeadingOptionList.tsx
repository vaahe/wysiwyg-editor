import type { FC } from 'react';
import { HeadingOptionItem } from '../HeadingOptionItem';
import type { HeadingOption, HeadingValue } from '../HeadingDropdown';

type Props = {
  options: HeadingOption[];
  current: HeadingValue;
  onSelect: (value: HeadingValue) => void;
};

export const HeadingOptionList: FC<Props> = ({ options, current, onSelect }) => {
  return (
    <div role="listbox" className="vb-block-picker-list">
      {options.map((option) => (
        <HeadingOptionItem
          key={option.value}
          option={option}
          active={option.value === current}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
