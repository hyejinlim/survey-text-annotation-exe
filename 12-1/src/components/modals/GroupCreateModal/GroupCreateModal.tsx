import { memo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormFeedback,
} from 'reactstrap';
import TextField from '~/components/shared/TextField';
import { getGroupFormSchema } from '~/validations/setting/groupFromValidations';

type Props = {
  show: boolean;
  onClose: () => void;
  selectedGroupTitle?: any;
  onAddGroup: any;
};

function GroupCreateModal({
  show,
  onClose,
  selectedGroupTitle,
  onAddGroup,
}: Props) {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: getGroupFormSchema() });

  const handleChange = ({ name, value }: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleClose = () => {
    onClose && onClose();
  };

  const handleClick = (values: any) => {
    const newValues = { ...values, tagDescript: '' };
    onAddGroup(newValues);

    onClose();
  };

  return (
    <Modal isOpen={show} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        {selectedGroupTitle && selectedGroupTitle} 추가
      </ModalHeader>
      <ModalBody>
        <Form>
          <div className="mb-3">
            <Label className="form-label">그룹명</Label>
            <TextField
              name="groupName"
              invalid={!!errors?.groupName}
              onChange={handleChange}
              placeholder="그룹명을 입력해주세요."
            />
            {!!errors?.groupName && (
              <FormFeedback type="invalid">
                {errors?.groupName?.message}
              </FormFeedback>
            )}
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit(handleClick)}>
          저장
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default memo(GroupCreateModal);
