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
import { getCodeDetailFormSchema } from '~/validations/setting/code/codeDetailFormValidations';
import { getInitialFormValues } from './functions';

type Props = {
  show?: boolean;
  item?: any;
  submitText: string;
  onClose: () => void;
  onSubmit: (values: any) => void;
};

function CodeDetailModal({ show, item, submitText, onClose, onSubmit }: Props) {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ resolver: getCodeDetailFormSchema() });

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
      <ModalHeader toggle={handleClose}>상세코드 {submitText}</ModalHeader>
      <ModalBody>
        <Form>
          <div className="mb-3">
            <Label className="form-Label">상세코드ID</Label>
            <TextField
              name="codeDetailId"
              onChange={handleChange}
              value={getValues('codeDetailId')}
              placeholder="상세코드ID를 입력해주세요."
              disabled={!isCreatePage}
              invalid={!!errors?.codeDetailId}
            />
            {!!errors?.codeDetailId && (
              <FormFeedback type="invalid">
                {errors?.codeDetailId?.message}
              </FormFeedback>
            )}
          </div>
          <div className="mb-3">
            <Label className="form-Label">코드이름</Label>
            <TextField
              name="codeDetailName"
              onChange={handleChange}
              value={getValues('codeDetailName')}
              placeholder="상세코드이름를 입력해주세요."
              invalid={!!errors?.codeDetailName}
            />
            {!!errors?.codeDetailName && (
              <FormFeedback type="invalid">
                {errors?.codeDetailName?.message}
              </FormFeedback>
            )}
          </div>
          <div className="mb-3">
            <Label className="form-Label">코드설명</Label>
            <TextField
              name="codeDetailDescript"
              onChange={handleChange}
              value={getValues('codeDetailDescript')}
              placeholder="상세코드설명을 입력해주세요."
              invalid={!!errors?.codeDetailDescript}
            />
            {!!errors?.codeDetailDescript && (
              <FormFeedback type="invalid">
                {errors?.codeDetailDescript?.message}
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

export default memo(CodeDetailModal);
