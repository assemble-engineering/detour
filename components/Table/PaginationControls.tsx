import { TableInstance } from 'react-table';
import { RedirectType } from '../../types';
import Button from '../Button';

const PaginationControls = ({ useTableProps }: { useTableProps: TableInstance<RedirectType> }) => {
  const {
    gotoPage,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageCount,
    pageOptions,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTableProps;

  return (
    <div className="flex justify-between my-2">
      <div>
        <Button size="small" color="transparent" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <span className="sr-only">First page</span>
          {'<<'}
        </Button>{' '}
        <Button size="small" color="transparent" onClick={() => previousPage()} disabled={!canPreviousPage}>
          <span className="sr-only">Previous page</span>
          {'<'}
        </Button>{' '}
        <Button size="small" color="transparent" onClick={() => nextPage()} disabled={!canNextPage}>
          <span className="sr-only">Next page</span>
          {'>'}
        </Button>{' '}
        <Button size="small" color="transparent" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <span className="sr-only">Last page</span>
          {'>>'}
        </Button>{' '}
        <span>
          Page <strong>{pageIndex + 1}</strong> of {pageOptions.length}{' '}
        </span>
      </div>
      <div>
        Go to page:{' '}
        <input
          className="border border-gray-150 w-[100px] h-[35px] rounded-md p-1"
          type="number"
          value={pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
        />
        <select
          className="border border-gray-150 w-[100px] h-[35px] rounded-md p-1 ml-2"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginationControls;
