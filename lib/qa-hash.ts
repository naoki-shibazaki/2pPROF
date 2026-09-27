/**
 * djb2 hash — stable identifier for a Q&A question string.
 * Used to link comments to specific questions without a DB id.
 */
export function qaHash(question: string): string {
  let hash = 5381
  for (let i = 0; i < question.length; i++) {
    hash = ((hash << 5) + hash) ^ question.charCodeAt(i)
    hash = hash >>> 0 // keep as unsigned 32-bit
  }
  return hash.toString(36)
}
