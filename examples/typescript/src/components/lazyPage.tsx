import React, { lazy } from 'react'

export default function lazyPage(pageName: string) {
  return lazy(() => import(/* webpackChunkName: '[request]' */ `pages/${pageName}`))
}
