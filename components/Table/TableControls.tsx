import { TableInstance } from 'react-table';
import { Action } from '../../pages';
import { RedirectType } from '../../types';
import Button from '../Button';
import Search from './Search';

type TableControlsProps = {
  dispatch: React.Dispatch<Action>;
  useTableProps: TableInstance<RedirectType>;
  unmergedChanges: boolean;
  updatesMade: boolean;
  mergePull: () => void;
  saveRedirects: () => void;
  saving: boolean;
};

const TableControls = ({
  dispatch,
  useTableProps,
  mergePull,
  updatesMade,
  unmergedChanges,
  saveRedirects,
  saving,
}: TableControlsProps) => {
  const { setGlobalFilter, state, preGlobalFilteredRows, rows } = useTableProps;
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <Search
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
          preFilteredCount={preGlobalFilteredRows.length}
          count={rows.length}
        />
      </div>
      <div className="flex gap-4">
        <Button color="white" onClick={() => dispatch({ type: 'ADD_REDIRECT' })} disabled={saving}>
          + New Redirect
        </Button>
        {updatesMade ? (
          <Button color="blue" onClick={saveRedirects} disabled={saving}>
            Save changes
          </Button>
        ) : unmergedChanges ? (
          <Button onClick={mergePull} disabled={saving}>
            Publish changes
          </Button>
        ) : (
          <Button color="white" onClick={mergePull} disabled>
            All changes saved
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableControls;
