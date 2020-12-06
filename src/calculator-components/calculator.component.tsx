import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, StatusBar } from "react-native";
import { useCalculator } from "../calculator-logic/calculator-instance.hook";
import { ButtonColors, ButtonSize } from "../shared/constants";
import { ButtonsWrapper, CalculatorContainer } from "../styles/calculator";
import { Button } from "./button.component";
import { Display } from "./display-component";
import { ButtonGroup, ButtonSubgroup } from "./group.component";
import {
  DivideIcon,
  EqualsIcon,
  MinusIcon,
  MultiplyIcon,
  PercentIcon,
  PlusIcon,
} from "./icons";

export const Calculator = () => {
  const [buttonSize, setButtonSize] = useState(75);
  const [displayHeight, setDisplayHeight] = useState(75);

  useEffect(() => {
    const win = Dimensions.get("window");

    setButtonSize(Math.floor(win.width) / 4 - ButtonSize.margin * 2);
    setDisplayHeight(Math.floor(win.height - win.width / 0.66));
  }, []);

  const { handle, render } = useCalculator();

  const content = useMemo(render, [render]);

  return (
    <CalculatorContainer>
      <StatusBar backgroundColor={"#000000"} />

      <Display size={displayHeight} content={content} />

      <ButtonsWrapper>
        <ButtonGroup>
          <ButtonSubgroup color={ButtonColors.light} size={buttonSize} cols={3}>
            <Button onClick={handle} keyStr={"ac"} label={"AC"} />
            <Button onClick={handle} keyStr={"tsign"} label={"+-"} />
            <Button onClick={handle} keyStr={"%"} label={PercentIcon} />
          </ButtonSubgroup>

          <ButtonSubgroup
            color={ButtonColors.contrast}
            size={buttonSize}
            cols={1}
          >
            <Button onClick={handle} keyStr={"/"} label={DivideIcon} />
          </ButtonSubgroup>
        </ButtonGroup>

        <ButtonGroup>
          <ButtonSubgroup color={ButtonColors.main} size={buttonSize} cols={3}>
            <Button onClick={handle} keyStr={"mc"} label={"mc"} />
            <Button onClick={handle} keyStr={"mr"} label={"mr"} />
            <Button onClick={handle} keyStr={"mm"} label={"m-"} />
          </ButtonSubgroup>
          <ButtonSubgroup
            color={ButtonColors.contrast}
            size={buttonSize}
            cols={1}
          >
            <Button onClick={handle} keyStr={"mp"} label={"m+"} />
          </ButtonSubgroup>
        </ButtonGroup>

        <ButtonGroup>
          <ButtonSubgroup color={ButtonColors.main} size={buttonSize} cols={3}>
            <Button onClick={handle} keyStr={"7"} label={"7"} />
            <Button onClick={handle} keyStr={"8"} label={"8"} />
            <Button onClick={handle} keyStr={"9"} label={"9"} />
            <Button onClick={handle} keyStr={"4"} label={"4"} />
            <Button onClick={handle} keyStr={"5"} label={"5"} />
            <Button onClick={handle} keyStr={"6"} label={"6"} />
            <Button onClick={handle} keyStr={"1"} label={"1"} />
            <Button onClick={handle} keyStr={"2"} label={"2"} />
            <Button onClick={handle} keyStr={"3"} label={"3"} />
            <Button onClick={handle} keyStr={"0"} label={"0"} cols={2} />
            <Button onClick={handle} keyStr={"."} label={"."} />
          </ButtonSubgroup>

          <ButtonSubgroup
            color={ButtonColors.contrast}
            size={buttonSize}
            cols={1}
          >
            <Button onClick={handle} keyStr={"*"} label={MultiplyIcon} />
            <Button onClick={handle} keyStr={"-"} label={MinusIcon} />
            <Button onClick={handle} keyStr={"+"} label={PlusIcon} />
            <Button onClick={handle} keyStr={"="} label={EqualsIcon} />
          </ButtonSubgroup>
        </ButtonGroup>
      </ButtonsWrapper>
    </CalculatorContainer>
  );
};
