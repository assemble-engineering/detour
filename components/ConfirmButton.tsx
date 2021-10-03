import { useState } from "react";
import Button from "./Button";
import Close from "./icons/Close";
import Check from "./icons/Check";

const ConfirmButton = ({message='Are you sure?', buttonText='Delete', onConfirmClick}) => {
  const [confirmActive, setConfirmActive] = useState(false);

  return (
    <div>
      {confirmActive ? (
        <div className='ml-8'>
          <p className='text-center'>{message}</p>
          <div className='flex align-center'>
            <Button size='small' color='transparent' className='ml-4' onClick={() => setConfirmActive(false)}>
              <span className='sr-only'>Cancel</span>
              <Close colorClassName='text-red-500' />
            </Button>
            <Button size='small' color='transparent' className='ml-4' onClick={() => {onConfirmClick(); setConfirmActive(false);}}>
              <span className='sr-only'>Confirm</span>
              <Check colorClassName='text-green-500' />
            </Button>
          </div>
        </div>
      ) : (
        <Button size='small' color='transparent' className='ml-4' onClick={() => setConfirmActive(true)}>
          <span className='sr-only'>{buttonText}</span>
          <Close colorClassName='text-red-500' />
        </Button>
      )}
    </div>
  );
}

export default ConfirmButton;
