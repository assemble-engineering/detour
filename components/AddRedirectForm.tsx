import React, { useEffect, useState } from 'react';
import Button from './Button';
import TextInput from './TextInput';
import Check from './icons/Check';
import Close from './icons/Close';
import { RedirectType } from '../types';

type AddRedirectFormProps = {
  data?: RedirectType;
  onSubmit: (formData: RedirectType) => void;
  onCancel: () => void;
};

const AddRedirectForm = ({
  data,
  onSubmit,
  onCancel,
}: AddRedirectFormProps) => {
  const [formData, setFormData] = useState({ from: '', to: '', status: '301' });
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setFormData({ from: data.from, to: data.to, status: data.status });
    }
  }, [data]);

  const handleChange = (name: string, value: string | boolean) => {
    const newData = { ...formData, [name]: value };
    if (!dirtyFields.includes(name)) {
      setDirtyFields([...dirtyFields, name]);
    }
    setFormData(newData);
  };

  const handleSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='flex align-top w-full py-4'>
      <TextInput
        id='from'
        labelText='From'
        className='mb-4 mr-4 flex-1'
        inputClassName='py-4 px-3.5 w-full leading-4 text-left tracking-wider border border-gray-200'
        labelClassName='w-full left-4 overflow-hidden whitespace-nowrap'
        onChange={(value: string) => handleChange('from', value)}
        value={formData.from}
      >
        {dirtyFields.includes('from') && formData.from.length === 0 && (
          <p className='text-red-500'>This field is required</p>
        )}
      </TextInput>
      <TextInput
        id='to'
        labelText='To'
        className='mb-4 mr-4 flex-1'
        inputClassName='py-4 px-3.5 w-full leading-4 text-left tracking-wider border border-gray-200'
        labelClassName='w-full left-4 overflow-hidden whitespace-nowrap'
        onChange={(value: string) => handleChange('to', value)}
        value={formData.to}
      >
        {dirtyFields.includes('to') && formData.to.length === 0 && (
          <p className='text-red-500'>This field is required</p>
        )}
      </TextInput>
      <TextInput
        id='status'
        labelText='Status'
        className='mb-4 mr-4 flex-1'
        inputClassName='py-4 px-3.5 w-full leading-4 text-left tracking-wider border border-gray-200'
        labelClassName='w-full left-4 overflow-hidden whitespace-nowrap'
        onChange={(value: string) => handleChange('status', value)}
        value={formData.status}
        disabled
      />
      <div className='flex flex-row-reverse py-6'>
        <Button
          type='submit'
          color='transparent'
          title='Save redirect'
          disabled={
            !dirtyFields.length || !formData.from.length || !formData.to.length
          }
        >
          <span className='sr-only'>{data ? 'Update' : 'Add'} Redirect</span>
          <Check colorClassName='text-green-500' />
        </Button>
        <Button color='transparent' onClick={onCancel} title='Cancel'>
          <span className='sr-only'>Cancel</span>
          <Close colorClassName='text-red-400' />
        </Button>
      </div>
    </form>
  );
};

export default AddRedirectForm;
