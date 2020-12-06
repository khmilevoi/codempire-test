import React, { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import {
  DisplayContainer,
  DisplayContent,
  DisplayScroll,
} from "../styles/calculator.styles";

export type DisplayProps = {
  content: string;
  size: number;
};

export const Display: React.FunctionComponent<DisplayProps> = ({
  content,
  size,
}) => {
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollTo({ x: 0, animated: false });
    }
  }, [content, scroll.current]);

  return (
    <DisplayContainer size={size}>
      <DisplayScroll horizontal={true} ref={scroll}>
        <DisplayContent size={size} numberOfLines={1} ellipsizeMode={"clip"}>
          {content}
        </DisplayContent>
      </DisplayScroll>
    </DisplayContainer>
  );
};
