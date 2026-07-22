import { config } from '@/config'

const PREFIX = config.BASE_URL

export const storageKey = name => `${PREFIX}${name}`

export default storageKey
