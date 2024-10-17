import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Step2Props {
  onNext: (role: string) => void;
  onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ onNext, onBack }) => {
  const { register } = useForm<{ role: string }>();

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value;

    if (role) {
      onNext(role);
    }
  };

  return (
    <form onSubmit={handleNext}>
      <div className="role-group">
        <label htmlFor="role" className="role-label">
          Role:
        </label>
        <select id="role" {...register("role")} className="role-select">
          <option value="participant">Participant</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="button" onClick={onBack} className="back-button">
        Back
      </button>
      <button type="submit" className="submit-button">
        Next
      </button>
    </form>
  );
};

export default Step2;
