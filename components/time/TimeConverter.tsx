import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";

const TIME_UNITS = listUnits("time");

export default function TimeConverter() {
  return <ConverterForm units={TIME_UNITS} />;
}
