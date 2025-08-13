import {
  Connection,
  SignatureStatus,
  TransactionConfirmationStatus,
} from '@solana/web3.js'

/**
 * Custom transaction confirmation that polls faster than the default confirmTransaction
 * @param connection - Solana connection instance
 * @param signature - Transaction signature to confirm
 * @param desiredConfirmationStatus - Desired confirmation status
 * @param timeout - Maximum time to wait for confirmation in milliseconds
 * @returns The final signature status
 */
export async function confirmTransactionFast(
  connection: Connection,
  signature: string,
  desiredConfirmationStatus: TransactionConfirmationStatus = 'confirmed',
  timeout = 30000 // 30 seconds default timeout
): Promise<SignatureStatus> {
  const startTime = Date.now()

  while (true) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Transaction confirmation timeout after ${timeout}ms`)
    }

    const response = await connection.getSignatureStatuses([signature])
    const status = response.value[0]

    if (!status) {
      // If status is null, transaction hasn't been seen yet - wait a bit and retry
      await new Promise((resolve) => setTimeout(resolve, 300))
      continue
    }

    if (status.err) {
      const errorContext = {
        signature,
        error: status.err,
        slot: status.slot,
        confirmations: status.confirmations,
        confirmationStatus: status.confirmationStatus,
        timeElapsed: Date.now() - startTime,
        desiredConfirmationStatus,
      }
      console.error(
        'Transaction failed:',
        JSON.stringify(errorContext, null, 2)
      )
      throw new Error(`Transaction failed: ${JSON.stringify(errorContext)}`)
    }

    // Return if we've reached our desired confirmation status
    if (
      status.confirmationStatus === desiredConfirmationStatus ||
      status.confirmationStatus === 'finalized'
    ) {
      return status
    }

    // If we're here, transaction is confirmed but not at our desired status yet
    // Poll faster than the default confirmTransaction
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
}
