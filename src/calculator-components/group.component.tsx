import React from "react";
import {
  ButtonGroupContainer,
  ButtonSubgroupContainer,
} from "../styles/calculator";

export type ButtonGroupProps = {};

export const ButtonGroup: React.FunctionComponent<ButtonGroupProps> = ({
  children,
}) => {
  return <ButtonGroupContainer>{children}</ButtonGroupContainer>;
};

export type ButtonSubgroupProps = {
  color: string;
  size: number;
  cols?: number;
};

export const ButtonSubgroup: React.FunctionComponent<ButtonSubgroupProps> = ({
  children,
  color,
  size,
  cols = 1,
}) => {
  return (
    <ButtonSubgroupContainer cols={cols} size={size}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { color, size });
        }

        return child;
      })}
    </ButtonSubgroupContainer>
  );
};
