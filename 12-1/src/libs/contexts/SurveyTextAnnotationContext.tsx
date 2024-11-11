import { createContext, useState } from 'react';

type Props = {
  children: any;
};

export const SurveyTextAnnotationContext = createContext<any>(null);
export default function AnnotationProvider({ children }: Props) {
  const [surveyId, setSurveyId] = useState<number>(-1); // 선택한 서베이 데이터 id
  const [document, setDocument] = useState<any>({}); // 작업중인 단일 도큐먼트
  const [selectedItem, setSelectedItem] = useState<string>(''); // 선택된 텍스트 이름
  const [selectedText, setSelectedText] = useState<string>(''); // 선택된 텍스트 데이터
  const [selectedKey, setSelectedKey] = useState<string>(''); // 선택된 텍스트 key
  const [exeLabelingList, setExeLabelingList] = useState<any>([]); // 라벨링 리스트
  const [reset, setReset] = useState<boolean>(false); // 초기화

  return (
    <SurveyTextAnnotationContext.Provider
      value={{
        surveyId,
        document,
        selectedText,
        selectedItem,
        selectedKey,
        exeLabelingList,
        reset,
        setSurveyId,
        setDocument,
        setSelectedText,
        setSelectedItem,
        setSelectedKey,
        setExeLabelingList,
        setReset,
      }}
    >
      {children}
    </SurveyTextAnnotationContext.Provider>
  );
}
