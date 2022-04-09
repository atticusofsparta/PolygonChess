import { BigNumberish } from '@ethersproject/bignumber';
import { CLValue, ToBytes } from './CLValue';
/**
 * Convert number to bytes
 */
export declare const toBytesNumber: (bitSize: number, signed: boolean) => (value: BigNumberish) => Uint8Array;
/**
 * Converts `u8` to little endian.
 */
export declare const toBytesU8: (value: BigNumberish) => Uint8Array;
/**
 * Converts `i32` to little endian.
 */
export declare const toBytesI32: (value: BigNumberish) => Uint8Array;
/**
 * Converts `u32` to little endian.
 */
export declare const toBytesU32: (value: BigNumberish) => Uint8Array;
/**
 * Converts `u64` to little endian.
 */
export declare const toBytesU64: (value: BigNumberish) => Uint8Array;
/**
 * Converts `i64` to little endian.
 */
export declare const toBytesI64: (value: BigNumberish) => Uint8Array;
/**
 * Converts `u128` to little endian.
 */
export declare const toBytesU128: (value: BigNumberish) => Uint8Array;
/**
 * Converts `u256` to little endian.
 */
export declare const toBytesU256: (value: BigNumberish) => Uint8Array;
/**
 * Converts `u512` to little endian.
 */
export declare const toBytesU512: (value: BigNumberish) => Uint8Array;
export declare const toBytesDeployHash: (deployHash: Uint8Array) => Uint8Array;
/**
 * Serializes a string into an array of bytes.
 */
export declare function toBytesString(str: string): Uint8Array;
export declare const fromBytesString: (byte: Uint8Array) => string;
/**
 * Serializes an array of u8, equal to Vec<u8> in rust.
 */
export declare function toBytesArrayU8(arr: Uint8Array): Uint8Array;
/**
 * Serializes a vector of values of type `T` into an array of bytes.
 */
export declare const toBytesVector: <T extends ToBytes>(vec: T[]) => Uint8Array;
export declare const toBytesVectorNew: <T extends CLValue>(vec: T[]) => Uint8Array;
/**
 * Serializes an byteArray, equal to [u8;n] in rust.
 */
export declare function toBytesBytesArray(arr: Uint8Array): Uint8Array;
