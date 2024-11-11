import { memo, useContext } from 'react';
import { Input } from 'reactstrap';
import CollapseBox from '~/components/shared/CollapseBox';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

function InterviewInspectionAccCheck() {
  const { document, labelingIndex, labelCheckList, setLabelCheckList } =
    useContext(InterviewTextAnnotationContext);
  const { inspectionChange } = document || {};
  const { label, list } = labelCheckList[labelingIndex] || {};

  const labelCheckListLength = labelCheckList?.length;
  const listLength = list?.length;
  const checkedLength = list?.filter(({ checked }: any) => checked)?.length;

  const handleChange = (checkId: any) => {
    const newCheckList = list.map((item: any) => {
      const { id, checked } = item;
      return checkId === id ? { ...item, checked: !checked } : item;
    });

    const newData = labelCheckList.with(labelingIndex, {
      ...labelCheckList[labelingIndex],
      list: newCheckList,
    });

    setLabelCheckList(newData);
  };

  if (labelingIndex > labelCheckListLength) return null;

  return (
    <CollapseBox
      key={label}
      title={
        <div className="d-flex gap-2">
          <span>{label}</span>
          <span>
            {checkedLength}/{listLength}
          </span>
        </div>
      }
      isOpen={true}
    >
      <div className="px-2 py-3 d-flex flex-column gap-2">
        {list?.map((checkbox: any, index: number) => {
          const { id, checked, label } = checkbox;
          return (
            <div
              key={`${labelingIndex}_${index}`}
              className="d-flex align-items-center gap-2"
            >
              <Input
                css={styles.checkbox}
                type="checkbox"
                checked={checked}
                onChange={() => handleChange(id)}
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
}

export default memo(InterviewInspectionAccCheck);
