import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";

const PRESSURE_UNITS = listUnits("pressure");

export default function PressureConverter() {
  return <ConverterForm units={PRESSURE_UNITS} />;
}
