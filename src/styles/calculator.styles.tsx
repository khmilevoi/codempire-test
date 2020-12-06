import styled from "styled-components/native";
import { ButtonSize } from "../shared/constants";

export const CalculatorContainer = styled.View`
  width: 100%;
  height: 100%;
  background-color: #000;
  padding-top: 15px;
  display: flex;
  justify-content: flex-end;
`;

// display

export const DisplayContainer = styled.View`
  width: 100%;
  height: ${({ size }) => size - 15}px;
  padding: 10px 15px;

  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const DisplayScroll = styled.ScrollView`
  transform: rotateY(180deg);
`;

export const DisplayContent = styled.Text`
  color: white;
  font-size: ${({ size }) => size * 0.4}px;
  text-align: right;

  transform: rotateY(180deg);
`;

// button

type ButtonContainerProps = {
  color: string;
  cols?: number;
  size: number;
};

const calculateButtonWidth = (cols: number, size: number) =>
  cols === 1 ? size : size * cols + ButtonSize.margin * 2 * (cols - 1);

export const ButtonContainer = styled.TouchableOpacity<ButtonContainerProps>`
  width: ${({ cols = 1, size }) => calculateButtonWidth(cols, size)}px;
  height: ${({ size }) => size}px;
  border-radius: 99999999px;
  margin: ${ButtonSize.margin}px;

  background-color: ${({ color }) => color};

  display: flex;
  align-items: flex-start;
`;

export const ButtonInner = styled.View`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonLabel = styled.Text`
  width: ${({ size }) => size}px;
  height: 100%;

  font-weight: bold;
  font-size: ${({ size }) => size * 0.4}px;
  text-align: center;
  line-height: ${({ size }) => size}px;

  color: white;
`;

export const ButtonsWrapper = styled.View``;

export const ButtonGroupContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

type ButtonSubgroupContainerProps = {
  cols: number;
  size: number;
};

const calculateWidth = (cols: number, size: number) =>
  (size + ButtonSize.margin * 2) * cols;

export const ButtonSubgroupContainer = styled.View<
  ButtonSubgroupContainerProps
>`
  max-width: ${({ cols, size }) =>
    cols ? calculateWidth(cols, size) + "px" : "none"}
  min-width: ${({ cols, size }) =>
    cols ? calculateWidth(cols, size) + "px" : "none"}

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
`;
