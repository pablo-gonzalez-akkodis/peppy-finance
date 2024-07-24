import styled from "styled-components";

import { RowStart } from "components/Row";
import { Search as SearchIcon } from "components/Icons";
import { useState, useEffect } from "react";

const SearchWrapper = styled(RowStart)`
  flex-flow: row nowrap;
  border-radius: 4px;
  padding: 0.2rem 0;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.text8};
  gap: 5px;

  & > * {
    &:first-child {
      width: fit-content;
      padding: 0 0.5rem;
      border-right: 1px solid ${({ theme }) => theme.bg8};
    }
  }
`;

const Input = styled.input<{
  [x: string]: any;
}>`
  height: fit-content;
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text8};
  padding-left: 2px;

  &::placeholder {
    color: ${({ theme }) => theme.text8};
  }
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.text8};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 0.6rem;
  `}
`;

export function InputField({
  searchProps,
  placeholder,
}: {
  searchProps: any;
  placeholder: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  useEffect(() => {
    if (isInputFocused && searchProps.onChange) {
      searchProps.onChange({ target: { value: inputValue } });
    }
  }, [inputValue, isInputFocused, searchProps.onChange]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };
  return (
    <SearchWrapper>
      <SearchIcon size={15} />
      <Input
        {...searchProps}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="text"
        placeholder={placeholder}
        spellCheck="false"
      />
    </SearchWrapper>
  );
}
