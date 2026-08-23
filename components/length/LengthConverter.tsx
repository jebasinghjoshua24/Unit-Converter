import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";

const LENGTH_UNITS = listUnits("length");

export default function LengthConverter() {
  return <ConverterForm units={LENGTH_UNITS} />;
}
