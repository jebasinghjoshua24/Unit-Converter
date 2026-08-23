import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";

const MASS_UNITS = listUnits("mass");

export default function MassConverter() {
  return <ConverterForm units={MASS_UNITS} />;
}
