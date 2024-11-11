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
import TextArea from '~/components/shared/TextArea/TextArea';
import TextField from '~/components/shared/TextField';
import { getQnaFormSchema } from '~/validations/board/qnaFormValidation';

type Props = {
  show?: boolean;
  onClose: () => void;
  onCreate?: (values: FormData) => void;
  submitText: string;
};

function QnaModal({ show, onClose, onCreate, submitText }: Props) {
  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: getQnaFormSchema() });

  const handleChange = ({ name, value }: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleClose = () => {
    reset();
    show && onClose();
  };

  const handleCodeCreate = async (values: any) => {
    if (show && onCreate) {
      try {
        onCreate(values);
        reset();
        onClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Modal isOpen={show} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>건의사항 추가</ModalHeader>
      <ModalBody>
        <Form>
          <div className="mb-3">
            <Label className="form-label">제목</Label>
            <TextField
              name="title"
              onChange={handleChange}
              value={getValues('title')}
              placeholder="제목을 입력해주세요."
              invalid={!!errors?.title}
            />
            {!!errors?.title && (
              <FormFeedback type="invalid">
                {errors?.title?.message}
              </FormFeedback>
            )}
          </div>

          <div className="mb-3">
            <Label className="form-label">내용</Label>
            <TextArea
              rows={3}
              name="text"
              onChange={handleChange}
              value={getValues('text')}
              placeholder="내용을 입력해주세요."
              minLength={2}
            />
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          type="submit"
          onClick={handleSubmit(handleCodeCreate)}
        >
          {submitText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default memo(QnaModal);
