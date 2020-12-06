import React from "react";
import { DisplayContainer, DisplayContent } from "../styles/calculator";

export type DisplayProps = {
  content: string;
  size: number;
};

export const Display: React.FunctionComponent<DisplayProps> = ({
  content,
  size,
}) => {
  return (
    <DisplayContainer size={size}>
      <DisplayContent size={size} numberOfLines={1} ellipsizeMode={"clip"}>
        {content}
      </DisplayContent>
    </DisplayContainer>
  );
};
