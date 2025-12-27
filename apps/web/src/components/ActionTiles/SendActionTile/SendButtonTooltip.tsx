import { PropsWithChildren } from 'react'

// Solana support removed - tooltip no longer needed
export function SendButtonTooltip({
  children,
  isSolanaOnlyWallet: _disabled,
}: PropsWithChildren<{ isSolanaOnlyWallet: boolean }>) {
  return <>{children}</>
}
