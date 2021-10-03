import classNames from 'classnames';

const Table = ({
  headers,
  rows,
  className,
}: {
  headers: string[];
  rows: any[];
  className?: string;
}): JSX.Element => {
  const renderHeaders = () => {
    return headers.map((header, i) => (
      <th
        key={`header-col-${i}`}
        scope='col'
        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
      >
        {header}
      </th>
    ));
  };

  const renderRows = () => {
    return rows.map((row, i) => (
      <tr key={`row-${i}`} className='border'>
        {row.map((column: any, i: number) => (
          <td key={`column-${i}`} className='px-6 py-4 whitespace-nowrap'>
            {column}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className={classNames(['flex flex-col', className && className])}>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-white'>
                <tr>{renderHeaders()}</tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {renderRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
