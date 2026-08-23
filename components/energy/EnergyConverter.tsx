import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";

const ENERGY_UNITS = listUnits("energy");

export default function EnergyConverter() {
  return <ConverterForm units={ENERGY_UNITS} />;
}
