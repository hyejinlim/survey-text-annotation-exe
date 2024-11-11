import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  fetchGroup,
  fetchCreatGroup,
  fetchModifyGroup,
  fetchModifyUsedGroup,
} from '~/api/setting/group';
import GroupCreateModal from '~/components/modals/GroupCreateModal/GroupCreateModal';
import CatManager from '~/components/shared/CatManager';

enum GroupList {
  LARGEGROUP = '소속',
  MIDDLEGROUP = '그룹',
  SMALLGROUP = '역할',
}
const EditeValue = {
  id: '',
  label: '',
  used: true,
  title: '',
};

function Group() {
  const [smallGroup] = useState([]);
  const [selectedGroupTitle, setSelectedGroupTitle] = useState('');
  const [showWarning, setShowWarning] = useState(false); // 경고 메시지
  const [editeValue, setEditeValue] = useState(EditeValue);
  const [groupModalShow, setGroupModalShow] = useState(false);

  const [LargeGroupId, setLargeGroupId] = useState('');
  const [middleGroupId, setMiddleGroupId] = useState('');
  const [smallGroupId, setSmallGroupId] = useState('');

  const { data: getAllLargeGroupData, refetch: refetchLargeGroupData } =
    useQuery(['largeGroupData'], () => fetchGroup());

  const { data: getAllmiddleGroupData, refetch: refetchMiddleGroupData } =
    useQuery(
      ['middleGroupData', LargeGroupId],
      () => fetchGroup(LargeGroupId),
      {
        enabled: !!LargeGroupId,
      }
    );

  const { data: getAllsmallGroupData, refetch: refetchSmallGroupData } =
    useQuery(
      ['smallGroupData', middleGroupId],
      () => fetchGroup(middleGroupId),
      {
        enabled: !!middleGroupId,
      }
    );

  /**새로운 그룹 추가하는 api코드 */
  const addGroupMutation = useMutation(fetchCreatGroup, {
    onSuccess: (data) => {
      const { result, message } = data.response.payload;
      if (result === 'error') {
        Swal.fire({
          icon: 'error',
          title: `${message}`,
          confirmButtonText: '확인',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '정상적으로 추가되었습니다',
          confirmButtonText: '확인',
        });
      }
    },
  });

  /**새로운  그룹명 업데이트하는 api코드 */
  const updateMutation = useMutation(fetchModifyGroup, {
    onSuccess: (data) => {
      if (editeValue.title === GroupList.LARGEGROUP) {
        refetchLargeGroupData();
      } else if (editeValue.title === GroupList.MIDDLEGROUP) {
        refetchLargeGroupData();
        refetchMiddleGroupData();
      } else {
        refetchMiddleGroupData();
        refetchSmallGroupData();
      }
      Swal.fire({
        icon: 'success',
        title: '변경사항이 저장되었습니다',
        confirmButtonText: '확인',
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: '변경사항 저장에 실패되었습니다.',
        confirmButtonText: '확인',
      });
    },
  });

  const usedGroupMutation = useMutation(fetchModifyUsedGroup, {
    onSuccess: (data) => {},
  });

  const notUsedGroupMutation = useMutation(fetchModifyUsedGroup, {
    onSuccess: (data) => {},
  });

  /** 복구하는 버튼 */
  const handleUsed = useCallback(
    (title: string, data: any) => {
      const updateUsed = {
        groupId: data.id,
        groupOpenTF: !data.used,
      };

      usedGroupMutation.mutate(
        {
          ...updateUsed,
        },
        {
          onSuccess: (data) => {
            if (title === GroupList.LARGEGROUP) {
              refetchLargeGroupData();
            } else if (title === GroupList.MIDDLEGROUP) {
              refetchMiddleGroupData();
            } else {
              refetchSmallGroupData();
            }
          },
        }
      );
    },
    [getAllLargeGroupData, getAllmiddleGroupData, getAllsmallGroupData]
  );

  /** 사용안함 버튼 -> 복구 */
  const handleNotUsed = useCallback(
    (title: string, data: any) => {
      const updateUsed = {
        groupId: data.id,
        groupOpenTF: !data.used,
      };
      notUsedGroupMutation.mutate(
        {
          ...updateUsed,
        },
        {
          onSuccess: (data) => {
            if (title === GroupList.LARGEGROUP) {
              refetchLargeGroupData();
            } else if (title === GroupList.MIDDLEGROUP) {
              refetchMiddleGroupData();
            } else {
              refetchSmallGroupData();
            }
          },
        }
      );
    },
    [getAllLargeGroupData, getAllmiddleGroupData, getAllsmallGroupData]
  );

  /**그룹추가하는 로직 */
  const handleAddGroup = (addGroup: any) => {
    if (selectedGroupTitle === GroupList.LARGEGROUP) {
      const newLargeGroup = {
        groupName: addGroup.groupName,
        groupDescript: '',
      };

      addGroupMutation.mutate(
        {
          ...newLargeGroup,
        },
        {
          onSuccess: (data) => {
            refetchLargeGroupData();
          },
        }
      );
    } else if (selectedGroupTitle === GroupList.MIDDLEGROUP) {
      const newMiddleGroup = {
        groupName: addGroup.groupName,
        parentGroupId: LargeGroupId,
        groupDescript: '',
      };

      addGroupMutation.mutate(
        {
          ...newMiddleGroup,
        },
        {
          onSuccess: () => {
            refetchMiddleGroupData();
          },
        }
      );
    } else if (selectedGroupTitle === GroupList.SMALLGROUP) {
      const newSmalleGroup = {
        groupName: addGroup.groupName,
        parentGroupId: middleGroupId,
        groupDescript: '',
      };

      addGroupMutation.mutate(
        {
          ...newSmalleGroup,
        },
        {
          onSuccess: () => {
            refetchSmallGroupData();
          },
        }
      );
    }
  };

  /** 그룹별 추가모달하는 버튼  */
  const handleAdd = useCallback(
    (title: any) => {
      if (title) {
        setSelectedGroupTitle(title);
      }

      if (title === GroupList.LARGEGROUP) {
        setGroupModalShow(true);
        setShowWarning(false);

        return;
      } else if (title === GroupList.MIDDLEGROUP) {
        if (LargeGroupId) {
          setGroupModalShow(true);
          setShowWarning(false);

          return;
        } else {
          setShowWarning(true);
          return;
        }
      } else if (title === GroupList.SMALLGROUP) {
        if (middleGroupId) {
          setGroupModalShow(true);
          setShowWarning(false);

          return;
        } else {
          setShowWarning(true);
          return;
        }
      }
    },
    [
      groupModalShow,
      selectedGroupTitle,
      LargeGroupId,
      middleGroupId,
      showWarning,
      groupModalShow,
    ]
  );

  /**소속 선택한 id */
  const handleSelectedLargeGroup = useCallback(
    (id: string) => {
      setLargeGroupId(id);
      setMiddleGroupId('');
      setSmallGroupId('');
      setShowWarning(false);
    },
    [getAllLargeGroupData, middleGroupId, setSmallGroupId, smallGroup]
  );

  /**목록 선택한 id */
  const handleSelectedMiddleGroup = useCallback(
    (id: string) => {
      setMiddleGroupId(id);
      setSmallGroupId('');
      setShowWarning(false);
    },
    [middleGroupId, smallGroupId]
  );

  /**권한 선택한 id  */
  const handleSelectedSmallGroup = useCallback(
    (id: string) => {
      setSmallGroupId(id);
      setShowWarning(false);
    },
    [smallGroupId]
  );

  /**바꾼 이름 서버에 보내는 로직  */
  const handleEdite = useCallback(
    (value: any) => {
      const { id, name, used } = value;
      const editValue = {
        groupId: id,
        groupName: name,
        groupOpenTF: used,
        groupDescript: '',
      };
      updateMutation.mutate({ ...editValue });
    },
    [editeValue]
  );
  const handlGroupModaleClose = useCallback(() => {
    setGroupModalShow(false);
  }, []);

  return (
    <div className="d-flex gap-4">
      <CatManager
        title="소속"
        key={GroupList.LARGEGROUP}
        data={getAllLargeGroupData?.response.payload}
        onShowWarning={showWarning}
        selectedId={LargeGroupId}
        onSelectedLargeGroup={handleSelectedLargeGroup}
        onUsed={handleUsed}
        onNotUsed={handleNotUsed}
        onAdd={handleAdd}
        setEditeValue={setEditeValue}
        editeValue={editeValue}
        onEdite={handleEdite}
      />
      <CatManager
        title="그룹"
        key={GroupList.MIDDLEGROUP}
        data={getAllmiddleGroupData?.response.payload}
        onShowWarning={showWarning}
        selectedId={middleGroupId}
        onSelectedMiddleGroup={handleSelectedMiddleGroup}
        onUsed={handleUsed}
        onNotUsed={handleNotUsed}
        onAdd={handleAdd}
        setEditeValue={setEditeValue}
        editeValue={editeValue}
        onEdite={handleEdite}
      />

      <CatManager
        key={GroupList.SMALLGROUP}
        data={getAllsmallGroupData?.response.payload}
        title="역할"
        selectedId={smallGroupId}
        onShowWarning={showWarning}
        onSelectedSmallGroup={handleSelectedSmallGroup}
        onUsed={handleUsed}
        onNotUsed={handleNotUsed}
        onAdd={handleAdd}
        setEditeValue={setEditeValue}
        editeValue={editeValue}
        onEdite={handleEdite}
      />

      <GroupCreateModal
        show={groupModalShow}
        onClose={handlGroupModaleClose}
        onAddGroup={handleAddGroup}
        selectedGroupTitle={selectedGroupTitle}
      />
    </div>
  );
}

export default memo(Group);
