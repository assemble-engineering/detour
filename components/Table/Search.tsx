import { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import Close from '../icons/Close';
import SearchIcon from '../icons/Search';

const Search = ({
  globalFilter,
  setGlobalFilter,
  count,
  preFilteredCount,
}: {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  count: number;
  preFilteredCount: number;
}) => {
  const [value, setValue] = useState(globalFilter || '');
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);
  return (
    <div className="pb-8 relative">
      <div className="max-w-[400px] relative grid grid-cols-[40px_1fr] border border-gray-200 rounded-md  focus-within:border-blue-400 focus-within:shadow-[0_0_0_2px] focus-within:shadow-blue-400 overflow-hidden">
        <label className="grid justify-center items-center  border-r border-gray-200" htmlFor="search">
          <span className="sr-only">Search</span>
          <SearchIcon colorClassName="text-gray-500" size={16} />
        </label>
        <input
          type="text"
          id="search"
          value={value}
          className="py-3 px-1 max-w-md w-full leading-4 text-left tracking-wider  outline-none"
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
        {value && (
          <button
            className="absolute right-0 top-0 p-2 m-1 rounded-full hover:bg-gray-100"
            onClick={() => {
              setValue('');
              onChange('');
            }}
          >
            <Close colorClassName="text-gray-500" />
          </button>
        )}
      </div>
      {value?.trim() ? (
        <span className="absolute bottom-0 text-gray-500">
          Showing {count} of {preFilteredCount} redirects
        </span>
      ) : null}
    </div>
  );
};
export default Search;
