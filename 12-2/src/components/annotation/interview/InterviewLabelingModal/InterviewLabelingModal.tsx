import { useCallback, useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import TextArea from '~/components/shared/TextArea';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onItemSave: (name: string, value: string, exclude: boolean) => void;
};

function InterviewLabelingModal({ isOpen, onClose, onItemSave }: Props) {
  const { getValues } = useFormContext();
  const { selectedItem, selectedText, selectedKey } = useContext(
    InterviewTextAnnotationContext
  );
  const [value, setValue] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 닫기
  const handleClose = () => {
    if (value && isEdit) {
      Swal.fire({
        icon: 'info',
        title: '작업을 중단하시겠습니까?',
        text: '작성하신 내용은 저장되지 않습니다.',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: `취소`,
      }).then((result) => {
        const { isConfirmed } = result;
        if (isConfirmed) {
          setIsEdit(false);
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  const handleChange = useCallback((e: any) => {
    setValue(e.value);
    setIsEdit(true);
  }, []);

  const handleClick = (value: string) => {
    const isIncludeIndex = R.includes('_', selectedKey);
    if (isIncludeIndex) {
      const [key] = R.pipe(R.split('_'))(selectedKey);
      const isExcludeItem = [
        'interviewAKey',
        'interviewAContext',
        'interviewAMatchView',
        'interviewATypeView',
      ].includes(key);
      onItemSave(selectedKey, value, isExcludeItem);
    } else {
      onItemSave(selectedKey, value, false);
    }
  };

  useEffect(() => {
    if (selectedText) {
      if (!value) setValue(selectedText);
      else {
        const mergeText = R.concat(value, ` ${selectedText}`);
        setValue(mergeText);
      }
      setIsEdit(true);
    }
  }, [selectedText]);

  // 초기화
  useEffect(() => {
    if (isOpen && getValues(selectedKey)) {
      setValue(getValues(selectedKey));
    } else {
      setValue('');
    }
  }, [isOpen, getValues]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      css={styles.modal}
      backdrop={false}
    >
      <ModalHeader toggle={handleClose} css={styles.modalHeader}>
        {selectedItem}
        <Button color="primary" onClick={() => handleClick(value)}>
          확인
        </Button>
      </ModalHeader>
      <ModalBody>
        <TextArea value={value} rows={10} onChange={handleChange} />
      </ModalBody>
    </Modal>
  );
}

export default InterviewLabelingModal;
