import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faDivide,
  faEquals,
  faMinus,
  faPercent,
  faPlus,
  faTimes,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { ButtonColors } from "../shared/constants";

const Icon: React.FunctionComponent<{ icon: IconDefinition }> = ({ icon }) => (
  <FontAwesomeIcon icon={icon} color={ButtonColors.label} />
);

export const PlusIcon = () => <Icon icon={faPlus} />;
export const MinusIcon = () => <Icon icon={faMinus} />;
export const MultiplyIcon = () => <Icon icon={faTimes} />;
export const DivideIcon = () => <Icon icon={faDivide} />;
export const EqualsIcon = () => <Icon icon={faEquals} />;
export const PercentIcon = () => <Icon icon={faPercent} />;
