import React, { useCallback } from "react";
import { ButtonColors } from "../shared/constants";
import {
  ButtonContainer,
  ButtonInner,
  ButtonLabel,
} from "../styles/calculator";

export type ButtonProps = {
  cols?: number;
  onClick: (key: string) => any;
  keyStr: string;
  label: React.FunctionComponent | string;
  color?: string;
  size?: number;
};

export const Button: React.FunctionComponent<ButtonProps> = ({
  cols = 1,
  label: Label,
  onClick,
  keyStr,
  color = ButtonColors.main,
  size,
}) => {
  const handleClick = useCallback(() => onClick(keyStr), [keyStr, onClick]);

  return (
    <ButtonContainer
      cols={cols}
      color={color}
      size={size}
      onPress={handleClick}
    >
      <ButtonInner size={size}>
        {typeof Label === "string" ? (
          <ButtonLabel size={size}>{Label}</ButtonLabel>
        ) : (
          <Label />
        )}
      </ButtonInner>
    </ButtonContainer>
  );
};
