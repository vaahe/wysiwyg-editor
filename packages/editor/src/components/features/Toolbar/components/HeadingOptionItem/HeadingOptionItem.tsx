import type { FC, MouseEvent } from "react";
import type { HeadingOption, HeadingValue } from "../HeadingDropdown";

type Props = {
  option: HeadingOption;
  active: boolean;
  onSelect: (value: HeadingValue) => void;
};

const FONT_SIZE: Record<HeadingValue, string> = {
  p:  "13px",
  h1: "18px",
  h2: "16px",
  h3: "14px",
  h4: "13px",
  h5: "12px",
  h6: "11px",
};

const FONT_WEIGHT: Record<HeadingValue, string> = {
  p:  "400",
  h1: "700",
  h2: "700",
  h3: "600",
  h4: "600",
  h5: "600",
  h6: "500",
};

export const HeadingOptionItem: FC<Props> = ({ option, active, onSelect }) => {
  const handleClick = () => onSelect(option.value);
  const handleMouseDown = (e: MouseEvent) => e.preventDefault();

  return (
    <div
      role="option"
      aria-selected={active}
      className={`vb-heading-option-item${active ? " is-active" : ""}`}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <span
        style={{
          fontSize: FONT_SIZE[option.value],
          fontWeight: FONT_WEIGHT[option.value],
          lineHeight: 1,
        }}
      >
        {option.label}
      </span>
      {active && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};
