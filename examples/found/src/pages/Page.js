import {unstable_createResource } from 'react-cache'
import style from './Page.scss'

import Worker from './my.worker'
import animated from './animated-overlay.gif'
import angleDown from './angle-down-solid.svg'
import msImg from './microsoftteam.jpg'

const worker = new Worker()

const ImgResource = unstable_createResource(src => new Promise(resolve => {
  const img = new Image()
  img.src = src
  img.onload = resolve
}))

const Img = ({ src, alt, ...props }) => {
  ImgResource.read(src)
  return <img src={src} alt={alt} {...props} />
}

export default () => {
  worker.postMessage({ a: 'rendered' })
  return (
    <div className={style.main}>
      <p>
        Hello <img src={angleDown} style={{ width: '1em' }} />
        World <a href="https://true.io">True IO</a>
        <Img src={animated} />
      </p>
      <p>
        <Img src={msImg} width="500px" />
      </p>
    </div>
  )
}
