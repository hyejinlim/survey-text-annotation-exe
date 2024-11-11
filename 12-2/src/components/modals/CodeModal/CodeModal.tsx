import { memo, useEffect } from 'react';
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
import L from 'lodash';
import TextField from '~/components/shared/TextField';
import { getCodeFormSchema } from '~/validations/setting/code/codeFormValidations';
import { getInitialFormValues } from './functions';

type Props = {
  show?: boolean;
  item?: any;
  submitText: string;
  onClose: () => void;
  onSubmit: (values: any) => void;
};

function CodeModal({ show, item, submitText, onClose, onSubmit }: Props) {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ resolver: getCodeFormSchema() });

  const handleChange = ({ name, value }: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleClose = () => {
    onClose();
  };

  const handleClick = (values: any) => {
    onSubmit(values);
  };

  const registerForm = () => {
    const initialFormValues = getInitialFormValues(item);

    L.flow([
      L.toPairs,
      (data) => {
        L.forEach(data, ([name, value]) => {
          if (L.isEmpty(item)) {
            register(name);
          }

          setValue(name, value);
        });
      },
    ])(initialFormValues);

    if (item) trigger();
  };

  useEffect(registerForm, [item]);

  const isCreatePage = L.isEmpty(item);

  return (
    <Modal isOpen={show} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>공통 코드 {submitText}</ModalHeader>
      <ModalBody>
        <Form>
          <div className="mb-3">
            <Label className="form-label">코드ID</Label>
            <TextField
              name="codeListId"
              onChange={handleChange}
              value={getValues('codeListId')}
              placeholder="코드ID를 입력해주세요."
              disabled={!isCreatePage}
              invalid={!!errors?.codeListId}
            />
            {!!errors?.codeListId && (
              <FormFeedback type="invalid">
                {errors?.codeListId?.message}
              </FormFeedback>
            )}
          </div>
          <div className="mb-3">
            <Label className="form-Label">코드이름</Label>
            <TextField
              name="codeListName"
              onChange={handleChange}
              value={getValues('codeListName')}
              placeholder="코드이름을 입력해주세요."
              invalid={!!errors?.codeListName}
            />
            {!!errors?.codeListName && (
              <FormFeedback type="invalid">
                {errors?.codeListName?.message}
              </FormFeedback>
            )}
          </div>
          <div className="mb-3">
            <Label className="form-Label">코드설명</Label>
            <TextField
              name="codeListDescript"
              onChange={handleChange}
              value={getValues('codeListDescript')}
              placeholder="코드설명을 입력해주세요."
              invalid={!!errors?.codeListDescript}
            />
            {!!errors?.codeListDescript && (
              <FormFeedback type="invalid">
                {errors?.codeListDescript?.message}
              </FormFeedback>
            )}
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          type="submit"
          color="primary"
          onClick={handleSubmit(handleClick)}
        >
          {submitText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default memo(CodeModal);
