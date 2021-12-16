import { Row } from 'react-table';
import { Action } from '../../pages';
import { RedirectType } from '../../types';
import Button from '../Button';
import LinkOut from '../icons/LinkOut';
import Restore from '../icons/Restore';
import Trash from '../icons/Trash';

const RowButtons = ({ row, dispatch }: { row: Row<RedirectType>; dispatch: React.Dispatch<Action> }) => {
  return (
    <td className=" px-6 py-4 flex items-center justify-end">
      {row.original.mergeStatus !== 'DELETED' ? (
        <Button
          size="small"
          color="transparent"
          className="ml-2"
          onClick={() => dispatch({ type: 'DELETE_REDIRECT', id: row.original.id })}
        >
          <span className="sr-only">Delete</span>
          <Trash colorClassName="text-red-300 hover:text-red-500" />
        </Button>
      ) : (
        <Button
          size="small"
          color="transparent"
          className="ml-2 "
          onClick={() => dispatch({ type: 'RESTORE_REDIRECT', id: row.original.id })}
        >
          <span className="sr-only">Restore</span>
          <Restore colorClassName="text-gray-300 hover:text-gray-500" />
        </Button>
      )}
      <Button
        as="a"
        href={`https://girlfriend.com${row.original.from}`}
        size="small"
        color="transparent"
        className="ml-2"
      >
        <span className="sr-only">View page</span>
        <LinkOut size={20} colorClassName="text-gray-300 hover:text-gray-500" />
      </Button>
    </td>
  );
};

export default RowButtons;
