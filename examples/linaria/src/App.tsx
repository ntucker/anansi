import React from 'react';
import { css } from 'linaria';
import { styled } from 'linaria/react';

type Params = {
  type: 'min-width' | 'max-width';
  width: number;
  important?: boolean;
};

// // Apply !important to all styles
// const importantCss = (...args: any) => {
//   // @ts-ignore
//   return css(...args).map(style =>
//     typeof style === 'string' ? style.replace(/;/g, ' !important;') : style,
//   );
// };

// // const createMedia = ({ width, type, important }: Params) => {
// //   return (...args: any) => css`
// //     @media (${type}: ${width}px) {
// //       ${important 
// //         ? importantCss(...args)
// //         // @ts-ignore
// //         : css(...args)};
// //     }
// //   `;
// // };

// const media = {
//   phone: createMedia({
//     type: 'max-width',
//     width: 560,
//     important: true /* We should drop this hack one day */,
//   }),
//   tablet: createMedia({ type: 'max-width', width: 768 }),
//   desktop: createMedia({
//     type: 'min-width',
//     width: 769,
//   }),
//   giant: createMedia({
//     type: 'min-width',
//     width: 1170,
//   }),
// };

const Container = styled.div`
  border-radius: 4px;
  border: thin #eee solid;
  background-color: crimson;
  padding: 16px;
`

const Text = styled.p`
  font-size: 16px;
  color: white;
  font-weight: bold;
  
`

const header = css`
  text-transform: uppercase;
`

const App = () => (
  <>
    <h1 className={header}>Linaria Test</h1>
    <Container>
      <Text>
        hello world!
      </Text>
    </Container>
  </>
);

export default React.memo(App);
