import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";

const CURRENCY_UNITS = listUnits("currency");

export default function CurrencyConverter() {
  return <ConverterForm units={CURRENCY_UNITS} />;
}
