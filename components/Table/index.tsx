import React from 'react';
import classNames from 'classnames';
import { TableInstance } from 'react-table';
import { Action } from '../../pages';
import { RedirectType } from '../../types';
import UpArrow from '../icons/UpArrow';
import DownArrow from '../icons/DownArrow';
import PaginationControls from './PaginationControls';
import RowButtons from './RowButtons';
import Cell from './Cell';

const Table = ({
  useTableProps,
  className,
  dispatch,
  loading,
}: {
  useTableProps: TableInstance<RedirectType>;
  dispatch: React.Dispatch<Action>;
  className?: string;
  loading: boolean;
}): JSX.Element => {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } = useTableProps;

  return (
    <div
      className={classNames(['flex flex-col', className && className], { 'opacity-70 pointer-events-none': loading })}
    >
      <div className="border-b border-gray-200">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <div className="flex items-center">
                      {column.render('Header')}&nbsp;
                      <span>{column.isSorted ? column.isSortedDesc ? <DownArrow /> : <UpArrow /> : '  '}</span>
                    </div>
                  </th>
                ))}
                <th></th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td className="px-6 py-4 whitespace-nowrap" {...cell.getCellProps()}>
                      <Cell cell={cell} dispatch={dispatch} />
                    </td>
                  ))}
                  <RowButtons row={row} dispatch={dispatch} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <PaginationControls useTableProps={useTableProps} />
      </div>
    </div>
  );
};

export default Table;
