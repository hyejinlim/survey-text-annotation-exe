import { Fragment, memo, useEffect, useState } from 'react';
import { Button, Input, Table } from 'reactstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import {
  fetchAuthorityMenuList,
  fetchInsertAuthorityMenuList,
} from '~/api/setting/authority';
import Loading from '~/components/shared/Loading';
import * as styles from './styles';
import { MenuType } from '../types';

type Props = {
  mid: string;
};
function MenuAuthority({ mid }: Props) {
  const [menuRows, setMenuRows] = useState<MenuType[]>([]);

  const { data: authorityMenuList } = useQuery({
    queryKey: ['authorityMenuList', mid],
    queryFn: () => fetchAuthorityMenuList(mid),
    enabled: !!mid,
  });

  const mutation = useMutation(fetchInsertAuthorityMenuList, {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: '변경사항이 저장되었습니다',
        confirmButtonText: '확인',
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: '변경사항 저장에 실패되었습니다.',
        confirmButtonText: '확인',
      });
    },
  });

  const handleMenuChange = (params: any, field: keyof MenuType) => {
    const updatedRows = menuRows.map((row: any) => {
      if (row.id === params.id) {
        const updatedRow = {
          ...row,
          [field]: !row[field],
        };

        if (field === 'allSelected') {
          // If "일괄선택" is clicked and changed to true, set all menu options to true
          if (updatedRow.allSelected) {
            updatedRow.menuC = true;
            updatedRow.menuR = true;
            updatedRow.menuO = true;
            updatedRow.menuU = true;
            updatedRow.menuD = true;
          } else {
            // If "일괄선택" is clicked and changed to false, set all menu options to false
            updatedRow.menuC = false;
            updatedRow.menuR = false;
            updatedRow.menuO = false;
            updatedRow.menuU = false;
            updatedRow.menuD = false;
          }
        } else {
          // If any individual menu option is clicked and changed, check if all menu options are selected
          const allSelected =
            updatedRow.menuC &&
            updatedRow.menuR &&
            updatedRow.menuO &&
            updatedRow.menuU &&
            updatedRow.menuD;

          updatedRow.allSelected = allSelected;
        }

        return updatedRow;
      }
      return row;
    });

    setMenuRows(updatedRows);
  };

  /** 메뉴 권한 저장 */
  const handleMenuSubmit = () => {
    const inserValues = {
      memberNo: mid,
      insertValue: menuRows,
    };
    mutation.mutate({ ...inserValues });
  };

  useEffect(() => {
    if (authorityMenuList)
      setMenuRows(
        authorityMenuList.response.payload.map((item: MenuType) => {
          const { menuC, menuR, menuU, menuD, menuO } = item;
          const allSelected = R.all(R.equals(true))([
            menuC,
            menuR,
            menuU,
            menuD,
            menuO,
          ]);
          return { ...item, allSelected };
        })
      );
  }, [authorityMenuList]);

  if (!authorityMenuList) return <Loading />;
  return (
    <Fragment>
      <div className="table-responsive" css={styles.table}>
        <Table className="table table-bordered mb-0">
          <thead className="bg-light-subtle">
            <tr>
              <th colSpan={2}>메뉴</th>
              <th>일괄선택</th>
              <th>노출</th>
              <th>생성</th>
              <th>조회</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody css={styles.tbody}>
            {menuRows.map((data: any) => {
              const {
                id,
                rowSpan,
                menuName,
                subMenuName,
                allSelected,
                menuO,
                menuC,
                menuR,
                menuU,
                menuD,
              } = data;
              return (
                <tr key={id}>
                  {rowSpan === 0 && <td>{subMenuName}</td>}
                  {rowSpan !== 0 && (
                    <>
                      <td rowSpan={rowSpan}>{menuName}</td>
                      <td>{subMenuName}</td>
                    </>
                  )}
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={allSelected || false}
                      onClick={() => handleMenuChange(data, 'allSelected')}
                    />
                  </td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={menuO || false}
                      onClick={() => handleMenuChange(data, 'menuO')}
                    />
                  </td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={menuC || false}
                      onClick={() => handleMenuChange(data, 'menuC')}
                    />
                  </td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={menuR || false}
                      onClick={() => handleMenuChange(data, 'menuR')}
                    />
                  </td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={menuU || false}
                      onClick={() => handleMenuChange(data, 'menuU')}
                    />
                  </td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={menuD || false}
                      onClick={() => handleMenuChange(data, 'menuD')}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-end py-3">
        <Button
          color="primary"
          variant="contained"
          onClick={handleMenuSubmit}
          size="lg"
        >
          {mutation.isLoading && (
            <div
              className="spinner-border spinner-border-sm me-2"
              role="status"
            />
          )}
          저장
        </Button>
      </div>
    </Fragment>
  );
}

export default memo(MenuAuthority);
