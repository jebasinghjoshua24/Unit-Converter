import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";

const TEMPERATURE_UNITS = listUnits("temperature");

export default function TemperatureConverter() {
  return <ConverterForm units={TEMPERATURE_UNITS} />;
}
