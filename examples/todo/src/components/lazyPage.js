import React, { lazy } from 'react'

export default function lazyPage(pageName) {
  return lazy(() => import(/* webpackChunkName: '[request]' */ `pages/${pageName}`))
}
