import styled from "styled-components";
import React, { useState } from "react";
import { RowStart } from "components/Row";
import { Search as SearchIcon } from "components/Icons";

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
  return (
    <SearchWrapper>
      <SearchIcon size={15} />
      <Input
        {...searchProps}
        type="text"
        placeholder={placeholder}
        spellCheck="false"
      />
    </SearchWrapper>
  );
}
