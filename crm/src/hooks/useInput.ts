import { useState, ChangeEvent } from "react";

type UseInputsReturnType = [
  Record<string, string>,
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
];

const useInput = (
  initialValues: Record<string, string>
): UseInputsReturnType => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return [values, handleChange];
};

export default useInput;
