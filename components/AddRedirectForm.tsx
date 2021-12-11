import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import TextInput from './TextInput';
import { RedirectType } from '../types';
import { Action } from '../pages';
import { useClickAway } from 'react-use';

type AddRedirectFormProps = {
  data: RedirectType;
  dispatch: React.Dispatch<Action>;
};

const AddRedirectForm = ({ data, dispatch }: AddRedirectFormProps) => {
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useClickAway(formRef, () => {
    dispatch({ type: 'CANCEL_EDIT' });
  });

  const handleChange = (name: 'to' | 'from' | 'status', value: string) => {
    if (!dirtyFields.includes(name)) {
      setDirtyFields([...dirtyFields, name]);
    }
    dispatch({
      type: 'EDIT_NEW_REDIRECT_FORM',
      newData: {
        ...data,
        [name]: value,
      },
    });
  };

  useEffect(() => {
    const firstInput = formRef.current?.elements?.[0] as HTMLInputElement | undefined;
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleSubmit = () => {
    dispatch({ type: 'SAVE_NEW_REDIRECT' });
  };

  return (
    <div className="fixed block top-0 l-0 w-screen h-screen z-999" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-8 bg-white w-11/12 max-w-screen-md mx-auto mt-8 rounded-md shadow-md"
      >
        <h3 className="text-2xl mb-8">Add new redirect</h3>
        <TextInput
          id="from"
          labelText="From"
          className="mb-4 mr-4 flex-1"
          inputClassName="py-4 px-3.5 w-full leading-4 text-left tracking-wider border border-gray-200"
          labelClassName="w-full left-4 overflow-hidden whitespace-nowrap"
          onChange={(value: string) => handleChange('from', value)}
          value={data.from}
        >
          {dirtyFields.includes('from') && data.from.length === 0 && (
            <p className="text-red-500">This field is required</p>
          )}
        </TextInput>
        <TextInput
          id="to"
          labelText="To"
          className="mb-4 mr-4 flex-1"
          inputClassName="py-4 px-3.5 w-full leading-4 text-left tracking-wider border border-gray-200"
          labelClassName="w-full left-4 overflow-hidden whitespace-nowrap"
          onChange={(value: string) => handleChange('to', value)}
          value={data.to}
        >
          {dirtyFields.includes('to') && data.to.length === 0 && <p className="text-red-500">This field is required</p>}
        </TextInput>
        <div>
          <label htmlFor="status" className="w-full left-4 overflow-hidden whitespace-nowrap">
            Status
          </label>
          <select
            className="py-4 px-3.5 w-full leading-4 text-left tracking-wider border border-gray-200"
            value={data.status}
            name="status"
            id="status"
            onChange={e => {
              handleChange('status', e.target.value);
            }}
          >
            <option value="302">302 (Normal Redirect)</option>
            <option value="404">404 (Page removed)</option>
          </select>
        </div>
        <div className="flex justify-between pt-6">
          <Button color="white" onClick={() => dispatch({ type: 'CANCEL_EDIT' })} title="Cancel">
            Cancel
          </Button>
          <Button
            type="submit"
            title="Save redirect"
            disabled={!dirtyFields.length || !data.from.length || !data.to.length}
          >
            Add Redirect
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddRedirectForm;
