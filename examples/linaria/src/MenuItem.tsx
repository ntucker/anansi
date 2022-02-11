import { styled } from '@linaria/react';
import type { ReactElement, ReactNode } from 'react';

import constants from 'myconstants';

const MenuItemContainer = styled.div`
  width: 32px;
  height: 32px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  color: ${constants.cringe};
  background-color: #ffffff;
  transition: background-color 0.25s;

  ${MenuItemContainer}:hover & {
    background-color: #f2f4f7;
  }
`;

const MenuItem = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <MenuItemContainer>
      <IconContainer>{children}</IconContainer>
    </MenuItemContainer>
  );
};
export default MenuItem;
