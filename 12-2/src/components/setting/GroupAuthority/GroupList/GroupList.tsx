import { useState, Fragment, memo } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Card,
  CardBody,
  CardHeader,
} from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchAuthorityGroup } from '~/api/setting/group';
import * as styles from './styles';

type Props = {
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
};

function GroupList({ setSelectedId }: Props) {
  const [selected, setSelected] = useState<{ [key: string]: any }>({
    group: null,
    subGroup: null,
    subGroup2: null,
    subGroup3: null,
  });

  const { data: authorityGroup } = useQuery({
    queryKey: ['authorityGroup'],
    queryFn: () => fetchAuthorityGroup(),
  });

  const handleGroup = (key: string, group: any) => {
    const isSameGroup = selected[key] === group;
    const isIncludes = ['group', 'subGroup'].includes(key);
    const isLast = key === 'subGroup3';
    const data = isSameGroup && !isLast ? null : group;

    if (isSameGroup && isIncludes) setSelectedId('');
    if (isLast) setSelectedId(data);

    setSelected((prev: any) => ({ ...prev, [key]: data }));
  };

  return (
    <Card className="font-size-16">
      <CardHeader className="bg-light-subtle">
        <h5>그룹 리스트</h5>
      </CardHeader>
      {authorityGroup && (
        <CardBody className="p-0" css={styles.container}>
          <ListGroup flush={true}>
            {authorityGroup.response.payload.map((group: any) => {
              const { id, title, subGroup1 } = group;
              return (
                <Fragment key={id}>
                  <ListGroupItem onClick={() => handleGroup('group', group)}>
                    <i
                      className={clsx('bx me-1', {
                        'bx-chevron-down': selected.group === group,
                        'bx-chevron-right': selected.group !== group,
                      })}
                    />
                    {title}
                  </ListGroupItem>
                  {selected.group === group &&
                    subGroup1.map((item: any) => {
                      const { id, title, subGroup2 } = item;
                      return (
                        <Fragment key={id}>
                          <ListGroupItem
                            css={styles.first}
                            onClick={() => handleGroup('subGroup', item)}
                          >
                            <i
                              className={clsx('bx me-1', {
                                'bx-chevron-down': selected.subGroup === item,
                                'bx-chevron-right': selected.subGroup !== item,
                              })}
                            />
                            {title}
                          </ListGroupItem>
                          {selected?.subGroup === item &&
                            subGroup2.map((item: any) => {
                              const { id, title, subGroup3 } = item;
                              return (
                                <Fragment key={id}>
                                  <ListGroupItem
                                    css={styles.second}
                                    onClick={() =>
                                      handleGroup('subGroup2', item)
                                    }
                                  >
                                    <i
                                      className={clsx('bx me-1', {
                                        'bx-chevron-down':
                                          selected.subGroup2 === item,
                                        'bx-chevron-right':
                                          selected.subGroup2 !== item,
                                      })}
                                    />
                                    {title}
                                  </ListGroupItem>
                                  {selected?.subGroup2 === item &&
                                    subGroup3.map((item: any) => {
                                      const { id, title } = item;
                                      return (
                                        <ListGroupItem
                                          key={id}
                                          css={
                                            selected.subGroup3 === item
                                              ? styles.selectedGroup3
                                              : styles.subGroup3
                                          }
                                          onClick={() =>
                                            handleGroup('subGroup3', item)
                                          }
                                        >
                                          {title}
                                        </ListGroupItem>
                                      );
                                    })}
                                </Fragment>
                              );
                            })}
                        </Fragment>
                      );
                    })}
                </Fragment>
              );
            })}
          </ListGroup>
        </CardBody>
      )}
    </Card>
  );
}

export default memo(GroupList);
