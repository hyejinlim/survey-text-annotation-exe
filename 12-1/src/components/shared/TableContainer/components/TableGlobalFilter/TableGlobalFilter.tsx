import { memo, useEffect, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import * as styles from './styles';

type Props = {
  rows: any;
  globalFilter?: any;
  setGlobalFilter: any;
  queryStringState?: any;
  onSearchKeyword: any;
};

function TableGlobalFilter({
  rows,
  globalFilter,
  setGlobalFilter,
  queryStringState,
}: Props) {
  const [value, setValue] = useState(globalFilter);
  const count = rows.length;

  const handleChange = useAsyncDebounce(() => {
    setGlobalFilter(value || undefined);
  }, 200);

  useEffect(() => {
    if (queryStringState) {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set('sv', value);
      const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  }, [value, queryStringState]);

  return (
    <>
      <div className="search-box d-flex">
        <div className="position-relative">
          <label
            htmlFor="search-bar-0"
            className="search-label"
            css={styles.reset}
          >
            <span id="search-bar-0-label" className="sr-only">
              Search this table
            </span>
            <input
              onChange={(e) => {
                const { value } = e.target;
                setValue(value);
                handleChange(value);
              }}
              id="search-bar-0"
              type="text"
              className="form-control"
              placeholder={`${count} records...`}
              value={value || ''}
              css={styles.input}
            />
          </label>

          <i className="bx bx-search-alt search-icon"></i>
        </div>
      </div>
    </>
  );
}

export default memo(TableGlobalFilter);
