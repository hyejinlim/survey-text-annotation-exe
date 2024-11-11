import { memo, useEffect, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { Button } from 'reactstrap';
import * as styles from './styles';

type Props = {
  rows: any;
  globalFilter?: any;
  queryStringState?: any;
  onSearchKeyword: any;
};

function TableGlobalFilter({
  rows,
  globalFilter,
  queryStringState,
  onSearchKeyword,
}: Props) {
  const [value, setValue] = useState(globalFilter);
  const queryParams = new URLSearchParams(window.location.search);

  const count = rows;

  const handleChange = useAsyncDebounce(() => {
    onSearchKeyword(value);
  }, 200);

  useEffect(() => {
    if (queryStringState) {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set('sv', value);
      const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  }, [value, queryStringState]);

  useEffect(() => {
    const sv = queryParams.get('sv');
    if (sv) setValue(sv);
  }, []);

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
              }}
              id="search-bar-0"
              type="text"
              className="form-control"
              placeholder={count ? `${count} records...` : `loading...`}
              value={value || ''}
              css={styles.input}
            />
          </label>
          <i className="bx bx-search-alt search-icon" />
          <button
            onClick={() => {
              setValue('');
              onSearchKeyword('');
            }}
            css={styles.deleteButton}
          >
            X
          </button>
        </div>
      </div>
      <Button color="secondary" onClick={handleChange}>
        검색
      </Button>
    </>
  );
}

export default memo(TableGlobalFilter);
