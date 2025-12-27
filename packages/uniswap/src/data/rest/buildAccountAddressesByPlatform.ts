import { Platform } from 'uniswap/src/features/platforms/types/Platform'

export type AccountAddressesByPlatform = Record<Platform, string>

/**
 * Builds a platform-keyed map of account addresses from input containing evmAddress.
 * This is used for React Query cache keys to avoid protobuf enum conversion.
 */
export function buildAccountAddressesByPlatform(input?: {
  evmAddress?: string
}): AccountAddressesByPlatform | undefined {
  return input?.evmAddress
    ? ({
        [Platform.EVM]: input.evmAddress,
      } as Record<Platform, string>)
    : undefined
}

/**
 * Type guard to check if a value is a valid `AccountAddressesByPlatform` object.
 */
export function isAccountAddressesByPlatform(value: unknown): value is AccountAddressesByPlatform {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const obj = value as Record<string, unknown>
  const validPlatforms = Object.values(Platform)
  const keys = Object.keys(obj)

  // Must have at least one key
  if (keys.length === 0) {
    return false
  }

  // Check that all keys are valid Platform values and all values are strings
  for (const key of keys) {
    if (!validPlatforms.includes(key as Platform)) {
      return false
    }
    if (typeof obj[key] !== 'string') {
      return false
    }
  }

  return true
}
