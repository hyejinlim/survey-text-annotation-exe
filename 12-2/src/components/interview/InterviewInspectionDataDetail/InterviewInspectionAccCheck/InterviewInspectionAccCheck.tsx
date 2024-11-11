import { memo, useContext, useEffect } from 'react';
import { Input } from 'reactstrap';
import * as R from 'ramda';
import CollapseBox from '~/components/shared/CollapseBox';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

type Props = {
  inspectionCheck?: any;
  setInspectionCheck?: any;
};

function InterviewInspectionAccCheck({
  inspectionCheck,
  setInspectionCheck,
}: Props) {
  const { document } = useContext(InterviewTextAnnotationContext);
  const { inspectionChange, checklist } = document || {};

  const handleChange = (index: number, checkId: any) => {
    const newCheckList = inspectionCheck[index].list.map((item: any) => {
      const { id, checked } = item;
      return checkId === id ? { ...item, checked: !checked } : item;
    });

    const newData = inspectionCheck.with(index, {
      ...inspectionCheck[index],
      list: newCheckList,
    });

    setInspectionCheck(newData);
  };

  useEffect(() => {
    if (checklist && !R.isEmpty(checklist)) {
      setInspectionCheck(checklist);
    }
  }, [checklist]);

  return (
    <>
      {inspectionCheck?.map((item: any, index: number) => {
        const { opened, label, list } = item;
        const checkedLength = list.filter(({ checked }: any) => checked).length;
        return (
          <CollapseBox
            key={label}
            title={
              <div className="d-flex gap-2">
                <span>{label}</span>
                <span>
                  {checkedLength}/{list.length}
                </span>
              </div>
            }
            isOpen={opened}
          >
            <div className="px-2 py-3 d-flex flex-column gap-2">
              {list.map((checkbox: any) => {
                const { id, checked, label } = checkbox;
                return (
                  <div key={id} className="d-flex align-items-center gap-2">
                    <Input
                      css={styles.checkbox}
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleChange(index, id)}
                      readOnly
                      disabled={!inspectionChange}
                    />
                    <span className="font-size-16">{label}</span>
                  </div>
                );
              })}
            </div>
          </CollapseBox>
        );
      })}
    </>
  );
}

export default memo(InterviewInspectionAccCheck);
