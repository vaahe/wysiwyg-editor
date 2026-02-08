import { CssUtils } from "../../../lib/utils";
import type { ButtonHTMLAttributes, FC, MouseEvent } from "react";

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
};

export const ToolbarButton: FC<ToolbarButtonProps> = (props) => {
  const btnClasses = CssUtils.setClasses([
    "vb-toolbar-btn",
    props.active && "is-active",
    props.disabled && "is-disabled",
  ]);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <button
      type="button"
      className={btnClasses}
      disabled={props.disabled}
      onMouseDown={handleMouseDown}
      onClick={props.onClick}
      aria-pressed={props.active}
    >
      {props.label}
    </button>
  );
};