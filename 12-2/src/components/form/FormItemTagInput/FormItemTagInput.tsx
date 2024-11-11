import { memo, useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import * as styles from './styles';

type Props = {
  label: string;
  name: string;
  placeholder?: string;
  readonly?: boolean;
};

function FormItemTagInput({
  label,
  name,
  placeholder,
  readonly = false,
}: Props) {
  const { getValues, setValue } = useFormContext();
  const [tags, setTags] = useState<string[]>([]);

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;

      const value = e.target.value;
      if (!value.trim()) return;

      const newTags = [...tags, value];
      setTags(newTags);
      setValue(name, newTags);
      e.target.value = '';
    },
    [tags]
  );

  const handleTagDelete = useCallback(
    (index: number) => {
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
      setValue(name, newTags);
    },
    [tags]
  );

  useEffect(() => {
    if (getValues(name)) {
      setTags(getValues(name));
    }
  }, [getValues(name)]);

  return (
    <div className="d-flex py-1 align-items-center">
      <span className="card-text col-4">{label}</span>
      <span className="card-text flex-grow-1">
        <div css={styles.tagsInputContainer}>
          {tags.map((tag, index) => (
            <div
              key={index}
              className="d-flex gap-2 bg-light-subtle px-2"
              css={styles.tag}
            >
              <span>{tag}</span>
              {!readonly && (
                <span role="button" onClick={() => handleTagDelete(index)}>
                  <i className="fas fa-window-close" />
                </span>
              )}
            </div>
          ))}
          {!readonly && (
            <input
              type="text"
              css={styles.tagsInput}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              readOnly={readonly}
            />
          )}
        </div>
      </span>
    </div>
  );
}

export default memo(FormItemTagInput);
