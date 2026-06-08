import { useRef, type FC } from "react";
import { useEditorContext } from "../../../../../react-bindings";
import { ToolbarButton } from "../../../../primitives/ToolbarButton/ToolbarButton";

export const InsertImageButton: FC = () => {
  const { exec, snapshot } = useEditorContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = snapshot.canSetBlocks.length === 0;

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      exec({ type: "insertImage", src: reader.result as string, alt: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <ToolbarButton
        label="Image"
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleClick}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
};
