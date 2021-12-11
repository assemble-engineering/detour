import { useEffect, useState } from 'react';

// Create an editable cell renderer
const StatusSelectCell = ({
  value: initialValue,
  updateMyData,
}: {
  value: string | number;
  updateMyData: (value: string | number) => void;
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <select
      name="status"
      id="status"
      onChange={onChange}
      onBlur={onBlur}
      className="py-2 px-1 max-w-md w-[70px] border border-white hover:border-gray-200 rounded-md"
    >
      <option value={302}>302</option>
      <option value={404}>404</option>
    </select>
  );
};
export default StatusSelectCell;
