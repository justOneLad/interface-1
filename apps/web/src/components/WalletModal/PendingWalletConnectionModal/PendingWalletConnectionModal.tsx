import {
  getWalletRequiresSeparatePrompt,
  useHasAcceptedSolanaConnectionPrompt,
} from 'components/WalletModal/PendingWalletConnectionModal/state'
import { WalletIconWithRipple } from 'components/WalletModal/WalletIconWithRipple'
import { useConnectionStatus } from 'features/accounts/store/hooks'
import { useConnectWallet } from 'features/wallet/connection/hooks/useConnectWallet'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, Flex, HeightAnimator, Text } from 'ui/src'
import { CloseIconWithHover } from 'ui/src/components/icons/CloseIconWithHover'
import { Modal } from 'uniswap/src/components/modals/Modal'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { useEvent } from 'utilities/src/react/hooks'

/** Returns a wallet IF it's currently connecting AND requires separate prompts. */
function useApplicablePendingWallet() {
  const { pendingWallet, isConnecting } = useConnectWallet()

  if (!isConnecting || !pendingWallet || !getWalletRequiresSeparatePrompt(pendingWallet.id)) {
    return undefined
  }

  return pendingWallet
}

/** Modal for wallets that shows connection status. Solana support removed. */
export default function PendingWalletConnectionModal() {
  const applicablePendingWallet = useApplicablePendingWallet()
  const { reset: resetConnectionQuery } = useConnectWallet()

  const closeModal = useEvent(() => {
    resetConnectionQuery()
  })

  const modalContent = useModalContent({ showSolanaPrompt: false })

  const isOpen = Boolean(applicablePendingWallet)

  return (
    <Modal name={ModalName.PendingWalletConnection} isModalOpen={isOpen} onClose={closeModal}>
      <Flex fill alignItems="flex-end">
        <CloseIconWithHover onClose={closeModal} size="$icon.20" />
      </Flex>
      <HeightAnimator useInitialHeight animation="200ms">
        <Flex width="100%" alignItems="center" gap="$spacing24">
          <WalletIconWithRipple
            src={modalContent?.icon}
            alt={`${applicablePendingWallet?.name}-pending-modal-icon`}
            size={48}
            showRipple={modalContent?.animate}
          />
          <Flex width="100%" fill position="relative" minHeight={60}>
            <AnimatePresence initial={false}>
              <Flex
                width="100%"
                position="absolute"
                top={0}
                left={0}
                right={0}
                alignItems="center"
                key={modalContent?.key}
                animation="200ms"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                gap="$spacing8"
              >
                <Text variant="subheading1" color="$neutral1">
                  {modalContent?.title}
                </Text>
                <Text variant="body2" color="$neutral2">
                  {modalContent?.description}
                </Text>
              </Flex>
            </AnimatePresence>
          </Flex>
          {/* Solana user input removed */}
        </Flex>
      </HeightAnimator>
    </Modal>
  )
}

function useModalContent(params: { showSolanaPrompt: boolean }) {
  const { t } = useTranslation()
  const { pendingWallet } = useConnectWallet()

  const evmConnecting = useConnectionStatus(Platform.EVM).isConnecting

  // Solana support removed - only show EVM connecting state
  const content = useMemo(() => {
    if (evmConnecting) {
      return {
        key: 'evm-connecting',
        title: t('wallet.connecting.title.evm', { walletName: pendingWallet?.name }),
        description: t('wallet.connecting.description'),
        icon: pendingWallet?.icon,
        animate: true,
      }
    }

    return undefined
  }, [evmConnecting, pendingWallet?.name, pendingWallet?.icon, t])

  return content
}
