// @flow

import 'es6-promise/auto'
import 'isomorphic-fetch'
import { compose } from 'ramda'

/**
 * Flow types
 */
type Options = {
  accessToken: string,
}

type UserFn = (options: {
  accessToken?: string,
  id?: string,
  size?: number,
}) => Promise<*>

type MediaFn = (options: {
  accessToken?: string,
  id?: string,
  size?: number,
  type?: 'recent' | 'liked',
}) => Promise<{}>

type InstagramInstance = {
  media: MediaFn,
  user: UserFn,
}

type QueryFn = (options: {
  accessToken: string,
  endpoint?: string,
  origin?: string,
  size?: number,
  version?: string,
}) => Promise<{}>

type CreateInstagramInstanceFn = (options: Options) => InstagramInstance

/**
 * Constants
 */
const DEFAULT_ENDPOINT = '/users/'
const DEFAULT_ORIGIN = 'https://api.instagram.com'
const DEFAULT_SIZE = 0
const DEFAULT_USER = 'self'
const DEFAULT_VERSION = 'v1'

/**
 * Error handling
 */
const handleErrors = res => {
  if (!res.ok) {
    throw new Error(res.statusText)
  }

  return res
}

/**
 * Core query
 */
const query: QueryFn = ({
  accessToken = '',
  endpoint = DEFAULT_ENDPOINT + DEFAULT_USER,
  origin = DEFAULT_ORIGIN,
  size = DEFAULT_SIZE,
  version = DEFAULT_VERSION,
}) => {
  const count: string = size ? `&count=${size}` : ''

  return fetch(
    `${origin}/${version}${endpoint}?access_token=${accessToken}${count}`,
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(({ data }) => data)
}

/**
 * Enhancers
 */
const withUserId = (id = DEFAULT_USER) => fn => ({ ...options }) =>
  fn({ ...options, endpoint: DEFAULT_ENDPOINT + id })

const withAccessToken = (accessToken = '') => fn => ({ ...options }) =>
  fn({ ...options, accessToken })

const withMedia = (type = 'recent') => fn => (
  { endpoint = DEFAULT_ENDPOINT + DEFAULT_USER, ...options } = {},
) => fn({ ...options, endpoint: `${endpoint}/media/${type}` })

const withCount = (count = 0) => fn => ({ ...options }) =>
  fn({
    ...options,
    count,
  })

/**
 * Public API
 */
export const user: UserFn = ({ accessToken, id }) =>
  compose(withUserId(id), withAccessToken(accessToken))(query)()

export const media: MediaFn = ({ accessToken, type, id, size = 10 }) =>
  compose(
    withUserId(id),
    withAccessToken(accessToken),
    withCount(size),
    withMedia(type),
  )(query)()

const createInstagramInstance: CreateInstagramInstanceFn = options => {
  if (
    !options ||
    typeof options !== 'object' ||
    typeof options.accessToken !== 'string'
  ) {
    throw new Error(
      `Couldn't find instagram accessToken.
      Did you pass the accessToken correctly?
      Should be like \`instagram({ accessToken: 'MY_TOKEN' })\``,
    )
  }
  const { accessToken } = options

  return {
    media: compose(withAccessToken(accessToken))(media),
    user: compose(withAccessToken(accessToken))(user),
  }
}

export default createInstagramInstance
