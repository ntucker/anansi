import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import React from 'react';

// Basic styled component
const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: darkblue;
  }
`;

// Styled component with props and interpolations
interface ContainerProps {
  size?: string;
  color?: string;
}

const Container = styled.div<ContainerProps>`
  padding: ${props => props.size || '16px'};
  background-color: ${props => props.color || 'white'};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Base component to be extended
const Base = styled.div`
  padding: 16px;
  border: 1px solid #ccc;
`;

// Extended styled component
const Extended = styled(Base)`
  margin: 8px;
  border-width: 2px;
`;

// CSS tagged template with variable interpolations
const color = 'blue';
const fontSize = '16px';
const stylesWithVars = css`
  color: ${color};
  font-size: ${fontSize};
`;

// CSS with nested selectors
const nestedStyles = css`
  .container {
    display: flex;
    flex-direction: column;
  }

  .item {
    padding: 8px;
  }
`;

// Styled component with nested selectors including component references
const StyledContainer = styled.div`
  padding: 16px;

  ${Button} {
    margin: 8px;
  }

  .icon {
    margin-right: 8px;
  }
`;

// Styled component with TypeScript props interface
interface ButtonProps {
  primary?: boolean;
}

const TypedButton = styled.button<ButtonProps>`
  background-color: ${props => (props.primary ? 'blue' : 'gray')};
  color: white;
  padding: 8px 16px;
`;

// Styled component with media queries
const media = {
  tablet: '768px',
  desktop: '1024px',
};

const ResponsiveContainer = styled.div`
  padding: 16px;

  @media (min-width: ${media.tablet}) {
    padding: 24px;
  }

  @media (min-width: ${media.desktop}) {
    padding: 32px;
  }
`;

// Styled component with CSS variables
const CSSVarContainer = styled.div`
  --main-color: blue;
  --padding-size: 16px;

  color: var(--main-color);
  padding: var(--padding-size);
`;

// Global styles with :global() selector
const globalStyles = css`
  :global() {
    body {
      margin: 0;
      font-family: sans-serif;
    }
  }
`;

// Styled component with conditional styles
const ConditionalButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  border: none;
  cursor: pointer;

  ${props =>
    props.disabled ?
      `
    opacity: 0.5;
    cursor: not-allowed;
  `
    : ``}
`;

// Header style
const header = css`
  text-transform: uppercase;
  font-size: 24px;
  margin-bottom: 16px;
`;

interface AppProps {
  name?: string;
}

function App({ name = 'Linaria' }: AppProps) {
  return (
    <>
      <div className={globalStyles} />
      <ResponsiveContainer>
        <h1 className={header}>Hello from {name} fixture</h1>
        <Container size="24px" color="red">
          <Button>Click me</Button>
          <TypedButton primary>Primary Button</TypedButton>
          <TypedButton>Secondary Button</TypedButton>
        </Container>
        <Extended>Extended Component</Extended>
        <div className={stylesWithVars}>CSS with variable interpolations</div>
        <div className={nestedStyles}>
          <div className="container">
            <div className="item">Nested styles</div>
          </div>
        </div>
        <StyledContainer>
          <Button>Button inside styled container</Button>
          <span className="icon">Icon</span>
        </StyledContainer>
        <CSSVarContainer>CSS Variables</CSSVarContainer>
        <ConditionalButton>Normal Button</ConditionalButton>
        <ConditionalButton disabled>Disabled Button</ConditionalButton>
      </ResponsiveContainer>
    </>
  );
}

export default App;
