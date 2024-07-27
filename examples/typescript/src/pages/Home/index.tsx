import path from 'path';
import * as variables from 'variables.scss';
import 'code.scss';
import * as sillyStyle from 'silly.module.scss';

import { IssueResource } from '@standard-endpoint/github/Issue';
import StaticBlock from '@standard-endpoint/github/StaticBlock';

import AngleDownUrl, {
  ReactComponent as AngleDown,
} from './angle-down-solid.svg';
import animated from './animated-overlay.gif';
import { ReactComponent as Copy } from './Copy.svg';
import * as style from './index.scss';
import * as plain from './plain.css';
import restHooks from './rest_hooks_logo_and_text.svg';
import myHtml from './test.html';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const worker = new Worker(new URL('./echo.js', import.meta.url));

export default function Home() {
  worker.postMessage({ message: 'rendered' });
  return (
    <div className={style.main}>
      <h3>
        Hello <img src={AngleDownUrl} style={{ width: '1em' }} />{' '}
        <AngleDown style={{ width: '1em' }} />
        World <a href="https://true.io">True IO</a>
        <span
          style={{ width: '10px', height: '10px', display: 'inline-block' }}
        >
          <Copy />
        </span>
      </h3>
      <p className={plain.mountainTop}>
        Ok again <img src={animated} /> {path.join('/hi/bob', 'test.txt')}{' '}
        {null ?? IssueResource.get.path} {StaticBlock.a}
      </p>
      <p className={sillyStyle.silly}>$text-color: {variables.textColor}</p>
      <p>
        <img src={restHooks} />
      </p>
      <code>{myHtml}</code>
    </div>
  );
}
