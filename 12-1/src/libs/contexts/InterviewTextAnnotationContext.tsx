import { createContext, useState } from 'react';

type Props = {
  children: any;
};

export const InterviewTextAnnotationContext = createContext<any>(null);
export default function AnnotationProvider({ children }: Props) {
  const [interviewId, setInterviewId] = useState<number>(-1); // 선택한 인터뷰 데이터 id
  const [document, setDocument] = useState<any>({}); // 작업중인 단일 도큐먼트
  const [selectedItem, setSelectedItem] = useState<string>(''); // 선택된 텍스트 이름
  const [selectedText, setSelectedText] = useState<string>(''); // 선택된 텍스트 데이터
  const [selectedKey, setSelectedKey] = useState<string>(''); // 선택된 텍스트 key
  const [labelingIndex, setLabelingIndex] = useState<number>(0);
  const [labelCheckList, setLabelCheckList] = useState<any>([]); // 선택한 인터뷰 라벨 검수 체크리스트

  return (
    <InterviewTextAnnotationContext.Provider
      value={{
        interviewId,
        document,
        selectedText,
        selectedItem,
        selectedKey,
        labelingIndex,
        labelCheckList,
        setInterviewId,
        setDocument,
        setSelectedText,
        setSelectedItem,
        setSelectedKey,
        setLabelingIndex,
        setLabelCheckList,
      }}
    >
      {children}
    </InterviewTextAnnotationContext.Provider>
  );
}
