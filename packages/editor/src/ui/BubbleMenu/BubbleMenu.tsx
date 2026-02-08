import { useRef, type FC, type ReactNode } from "react";
import { useHandleClickOutside } from "../../lib";

type Props = {
  open?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export const BubbleMenu: FC<Props> = ({ open, onClose, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useHandleClickOutside(ref, () => onClose?.());

  if (!open) return null;

  return (
    <div ref={ref} className={"vb-bubble-menu"}>
      {children}
    </div>
  );
}
