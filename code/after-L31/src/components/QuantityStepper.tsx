import { MAX_QTY } from "../cart/cartReducer";

type QuantityStepperProps = {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityStepper({ qty, onDecrease, onIncrease }: QuantityStepperProps) {
  return (
    <div className="stepper">
      <button
        type="button"
        className="stepper__btn"
        onClick={onDecrease}
        aria-label="One less"
      >
        −
      </button>
      <output className="stepper__qty">{qty}</output>
      <button
        type="button"
        className="stepper__btn"
        onClick={onIncrease}
        disabled={qty >= MAX_QTY}
        aria-label="One more"
      >
        +
      </button>
    </div>
  );
}
