import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Col,
  FormFeedback,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import L from 'lodash';
import { fetchContentsSelectInfo } from '~/api/fetches/fetchContents';
import Selectbox from '~/components/shared/Selectbox';
import TextField from '~/components/shared/TextField';
import { getWorkboardFormSchema } from '~/validations/workboard/workboardFormValidation';
import { getInitialFormValues } from './functions';

type Props = {
  isOpen: boolean;
  item?: any;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
};

function WorkBoardModal({ item, isOpen, onClose, onSubmit }: Props) {
  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: getWorkboardFormSchema(),
  });

  const handleChange = (title: any, values: any) => {
    setValue(title, values, { shouldValidate: true });
  };

  const { data: selectInfo } = useQuery({
    queryKey: ['selectInfo'],
    queryFn: fetchContentsSelectInfo,
  });

  const handleWorkSubmit = (values: any) => {
    onSubmit?.(values);
    handleClose();
  };

  const handleClose = () => {
    onClose?.();
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

  return (
    <Modal isOpen={isOpen} toggle={handleClose}>
      <ModalHeader toggle={onClose}>작업 할당</ModalHeader>
      <ModalBody>
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg="3">
            <Label>매체 분류</Label>
            <div className="d-flex flex-column">
              <Selectbox
                placeholder="매체 분류"
                name="contentsMediaCategory"
                items={selectInfo?.response.payload.contentsMediaCategory}
                value={getValues('contentsMediaCategory')}
                invalid={!!errors?.contentsMediaCategory}
                onChange={({ value }: any) =>
                  handleChange('contentsMediaCategory', value)
                }
              />
              {!!errors?.contentsMediaCategory && (
                <FormFeedback type="invalid">
                  {errors?.contentsMediaCategory.message}
                </FormFeedback>
              )}
            </div>
          </Col>
          <Col lg="9">
            <Label>IDX 번호</Label>
            <Row className="d-flex gx-0 justify-content-center">
              <Col lg={5}>
                <div className="d-flex flex-column">
                  <TextField
                    onChange={({ value }: any) =>
                      handleChange('workboardStart', value)
                    }
                    placeholder="시작"
                    value={getValues('workboardStart')}
                    type="number"
                    name="workboardStart"
                    invalid={!!errors?.workboardStart}
                  />
                  {!!errors?.workboardStart && (
                    <FormFeedback type="invalid">
                      {errors?.workboardStart?.message}
                    </FormFeedback>
                  )}
                </div>
              </Col>
              <Col lg={2} className="text-center">
                <span>~</span>
              </Col>
              <Col lg={5}>
                <div className="d-flex flex-column">
                  <TextField
                    onChange={(selectedOptions: any) =>
                      handleChange('workboardEnd', selectedOptions.value)
                    }
                    value={getValues('workboardEnd')}
                    placeholder="마지막"
                    type="number"
                    name="workboardEnd"
                    invalid={!!errors?.workboardEnd}
                  />
                  {!!errors?.workboardEnd && (
                    <FormFeedback type="invalid">
                      {errors?.workboardEnd?.message}
                    </FormFeedback>
                  )}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          type="submit"
          color="primary"
          onClick={handleSubmit(handleWorkSubmit)}
        >
          {item ? '수정' : '할당'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default memo(WorkBoardModal);
