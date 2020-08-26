import style from './index.scss';
import plain from './plain.css';
import Worker from './my.worker';
import animated from './animated-overlay.gif';
import AngleDownUrl, {
  ReactComponent as AngleDown,
} from './angle-down-solid.svg';
import restHooks from './rest_hooks_logo_and_text.svg';

const worker = new Worker();

export default function Home() {
  worker.postMessage({ message: 'rendered' });
  return (
    <div className={style.main}>
      <p>
        Hello <img src={AngleDownUrl} style={{ width: '1em' }} />{' '}
        <AngleDown style={{ width: '1em' }} />
        World <a href="https://true.io">True IO</a>
      </p>
      <p className={plain.mountainTop}>
        Ok again <img src={animated} />
      </p>
      <p>
        <img src={restHooks} />
      </p>
    </div>
  );
}
