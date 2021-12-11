import React, { memo } from 'react';
import { Cell as ReactTableCell } from 'react-table';
import { Action } from '../../pages';
import { RedirectType } from '../../types';
import EditableCell from './EditableCell';
import StatusCell from './StatusCell';
import StatusSelectCell from './StatusSelectCell';

const Cell = memo(({ cell, dispatch }: { cell: ReactTableCell<RedirectType>; dispatch: React.Dispatch<Action> }) => {
  switch (cell.column.id) {
    case 'mergeStatus': {
      return <StatusCell cell={cell} />;
    }
    case 'status': {
      return (
        <StatusSelectCell
          value={cell.value}
          updateMyData={(value: string | number) => {
            const newData = {
              to: cell.column.id === 'to' ? value.toString() : cell.row.original.to,
              from: cell.column.id === 'from' ? value.toString() : cell.row.original.from,
              status: cell.column.id === 'status' ? Number(value) : cell.row.original.status,
              id: cell.row.original.id,
              mergeStatus: cell.row.original.mergeStatus,
            };
            dispatch({ type: 'EDIT_REDIRECT', newData });
          }}
        />
      );
    }
    // eslint-disable-next-line no-fallthrough
    case 'to':
    case 'from': {
      return (
        <EditableCell
          value={cell.value}
          updateMyData={(value: string | number) => {
            const newData = {
              to: cell.column.id === 'to' ? value.toString() : cell.row.original.to,
              from: cell.column.id === 'from' ? value.toString() : cell.row.original.from,
              status: cell.column.id === 'status' ? Number(value) : cell.row.original.status,
              id: cell.row.original.id,
              mergeStatus: cell.row.original.mergeStatus,
            };
            dispatch({ type: 'EDIT_REDIRECT', newData });
          }}
        />
      );
    }
    default: {
      return null;
    }
  }
});

export default Cell;
