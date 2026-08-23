import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";

const SPEED_UNITS = listUnits("speed");

export default function SpeedConverter() {
  return <ConverterForm units={SPEED_UNITS} />;
}
