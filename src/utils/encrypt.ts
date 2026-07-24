import pki from 'node-forge/lib/pki.js'
import util from 'node-forge/lib/util.js'
import md5 from 'node-forge/lib/md5.js'

const PROD_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAUSr2fQ0oLS02aRzxjXDhxBYu
UYteGEw1AmZFveB3NzmSWMhXNkKn35gSulKxgMY9mSfnuSbIayEHQe8v7sHPIHv7
9V1jHqnRZrCiC7+twMh/49Z5tWW9FMh8YrSsdkaZ712vS6i9Of7aIePLB/QdFIMw
Ybp7B3zGs6iWuzMM2QIDAQAB
-----END PUBLIC KEY-----`

const publicKey = pki.publicKeyFromPem(PROD_PUBLIC_KEY_PEM)

export function encryptPwdRsa(password: string): string {
  return util.encode64(publicKey.encrypt(util.encodeUtf8(password)))
}

export function md5Hash(text: string): string {
  const hash = md5.create()
  return hash.update(text).digest().toHex().toUpperCase()
}
