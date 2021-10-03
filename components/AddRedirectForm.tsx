import { useEffect, useState } from "react";
import Button from "./Button";
import TextInput from './TextInput';

const AddRedirectForm = ({data, onSubmit}) => {
  const [formData, setFormData] = useState({from: '', to: '', status: '301'});
  const [dirtyFields, setDirtyFields] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setFormData({from: data.from, to: data.to, status: data.status})
    }
  }, [data]);

  const handleChange = (name: string, value: string | boolean) => {
    const newData = { ...formData, [name]: value };
    if (!dirtyFields.includes(name)) {
      setDirtyFields([...dirtyFields, name]);
    }
    setFormData(newData);
  };

  const handleSubmit = e => {
    e.preventDefault();

    onSubmit(formData);
  }

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
        {dirtyFields.includes('from') && formData.from.length === 0 && <p className='text-red-500'>This field is required</p>}
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
        {dirtyFields.includes('to') && formData.to.length === 0 && <p className='text-red-500'>This field is required</p>}
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
      <div className='py-6'>
        <Button type='submit' disabled={!dirtyFields.length || !formData.from.length || !formData.to.length}>{data ? 'Update' : 'Add'} Redirect</Button>
      </div>
    </form>
  )
}

export default AddRedirectForm;
