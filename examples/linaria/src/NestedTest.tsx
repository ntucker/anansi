import { css } from '@linaria/core';
import classnames from 'classnames';

const defaultStyle = css`
  color: red;
`;

const greenContentStyles = css`
  ${{
    [`&.${defaultStyle} .green`]: {
      display: 'inline-block',
      border: '1px solid green',
    },
  }}
`;

export default function NestedTest() {
  return (
    <div className={classnames(defaultStyle, greenContentStyles)}>
      Test<span className="green">ing</span>
    </div>
  );
}
