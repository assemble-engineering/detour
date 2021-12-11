import { Cell } from 'react-table';
import { RedirectType } from '../../types';

const STATUS_COLORS = {
  LIVE: 'bg-green-500',
  UPDATED: 'bg-yellow-500',
  DELETED: 'bg-red-500',
  NEW: 'bg-yellow-500',
};

const StatusCell = ({ cell }: { cell: Cell<RedirectType> }) => {
  const status = cell.row.original.mergeStatus;
  return (
    <div className={`rounded-full text-center text-white font-bold min-w-[100px] ${STATUS_COLORS[status]}`}>
      {status}
    </div>
  );
};

export default StatusCell;
