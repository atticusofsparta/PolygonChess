export { encodeBase64, decodeBase64 } from 'tweetnacl-util';
/**
 * Convert base64 encoded string to base16 encoded string
 *
 * @param base64 base64 encoded string
 */
export declare function base64to16(base64: string): string;
/**
 * Encode Uint8Array into string using Base-16 encoding.
 */
export declare function encodeBase16(bytes: Uint8Array): string;
/**
 * Decode Base-16 encoded string and returns Uint8Array of bytes.
 *
 * @param base16String base16 encoded string
 */
export declare function decodeBase16(base16String: string): Uint8Array;
