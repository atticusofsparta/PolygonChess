/**
 * Util methods for making Deploy message
 *
 * @packageDocumentation
 */
import { Result } from 'ts-results';
import { CLValue, CLPublicKey, ToBytes, CLURef, ToBytesResult } from './CLValue';
import { RuntimeArgs } from './RuntimeArgs';
import { DeployUtil } from './index';
import { AsymmetricKey } from './Keys';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
/**
 * Returns a humanizer duration
 * @param ttl in milliseconds
 */
export declare const humanizerTTL: (ttl: number) => string;
/**
 * Returns duration in ms
 * @param ttl in humanized string
 */
export declare const dehumanizerTTL: (ttl: string) => number;
export declare class UniqAddress {
    publicKey: CLPublicKey;
    transferId: BigNumber;
    /**
     * Constructs UniqAddress
     * @param publicKey CLPublicKey instance
     * @param transferId BigNumberish value (can be also string representing number). Max U64.
     */
    constructor(publicKey: CLPublicKey, transferId: BigNumberish);
    /**
     * Returns string in format "accountHex-transferIdHex"
     * @param ttl in humanized string
     */
    toString(): string;
    /**
     * Builds UniqAddress from string
     * @param value value returned from UniqAddress.toString()
     */
    static fromString(value: string): UniqAddress;
}
export declare class DeployHeader implements ToBytes {
    account: CLPublicKey;
    timestamp: number;
    ttl: number;
    gasPrice: number;
    bodyHash: Uint8Array;
    dependencies: Uint8Array[];
    chainName: string;
    /**
     * The header portion of a Deploy
     *
     * @param account The account within which the deploy will be run.
     * @param timestamp When the deploy was created.
     * @param ttl How long the deploy will stay valid.
     * @param gasPrice Price per gas unit for this deploy.
     * @param bodyHash  Hash of the Wasm code.
     * @param dependencies Other deploys that have to be run before this one.
     * @param chainName Which chain the deploy is supposed to be run on.
     */
    constructor(account: CLPublicKey, timestamp: number, ttl: number, gasPrice: number, bodyHash: Uint8Array, dependencies: Uint8Array[], chainName: string);
    toBytes(): ToBytesResult;
}
export interface DeployJson {
    session: Record<string, any>;
    approvals: {
        signature: string;
        signer: string;
    }[];
    header: DeployHeader;
    payment: Record<string, any>;
    hash: string;
}
/**
 * A struct containing a signature and the public key of the signer.
 */
export declare class Approval {
    signer: string;
    signature: string;
}
declare abstract class ExecutableDeployItemInternal implements ToBytes {
    abstract tag: number;
    abstract args: RuntimeArgs;
    abstract toBytes(): ToBytesResult;
    getArgByName(name: string): CLValue | undefined;
    setArg(name: string, value: CLValue): void;
}
export declare class ModuleBytes extends ExecutableDeployItemInternal {
    tag: number;
    moduleBytes: Uint8Array;
    args: RuntimeArgs;
    constructor(moduleBytes: Uint8Array, args: RuntimeArgs);
    toBytes(): ToBytesResult;
}
export declare class StoredContractByHash extends ExecutableDeployItemInternal {
    tag: number;
    hash: Uint8Array;
    entryPoint: string;
    args: RuntimeArgs;
    constructor(hash: Uint8Array, entryPoint: string, args: RuntimeArgs);
    toBytes(): ToBytesResult;
}
export declare class StoredContractByName extends ExecutableDeployItemInternal {
    tag: number;
    name: string;
    entryPoint: string;
    args: RuntimeArgs;
    constructor(name: string, entryPoint: string, args: RuntimeArgs);
    toBytes(): ToBytesResult;
}
export declare class StoredVersionedContractByName extends ExecutableDeployItemInternal {
    tag: number;
    name: string;
    version: number | null;
    entryPoint: string;
    args: RuntimeArgs;
    constructor(name: string, version: number | null, entryPoint: string, args: RuntimeArgs);
    toBytes(): ToBytesResult;
}
export declare class StoredVersionedContractByHash extends ExecutableDeployItemInternal {
    tag: number;
    hash: Uint8Array;
    version: number | null;
    entryPoint: string;
    args: RuntimeArgs;
    constructor(hash: Uint8Array, version: number | null, entryPoint: string, args: RuntimeArgs);
    toBytes(): ToBytesResult;
}
export declare class Transfer extends ExecutableDeployItemInternal {
    tag: number;
    args: RuntimeArgs;
    /**
     * Constructor for Transfer deploy item.
     * @param amount The number of motes to transfer
     * @param target URef of the target purse or the public key of target account. You could generate this public key from accountHex by CLPublicKey.fromHex
     * @param sourcePurse URef of the source purse. If this is omitted, the main purse of the account creating this \
     * transfer will be used as the source purse
     * @param id user-defined transfer id
     */
    constructor(args: RuntimeArgs);
    toBytes(): ToBytesResult;
}
export declare class ExecutableDeployItem implements ToBytes {
    moduleBytes?: ModuleBytes;
    storedContractByHash?: StoredContractByHash;
    storedContractByName?: StoredContractByName;
    storedVersionedContractByHash?: StoredVersionedContractByHash;
    storedVersionedContractByName?: StoredVersionedContractByName;
    transfer?: Transfer;
    toBytes(): ToBytesResult;
    getArgByName(name: string): CLValue | undefined;
    setArg(name: string, value: CLValue): void;
    static fromExecutableDeployItemInternal(item: ExecutableDeployItemInternal): DeployUtil.ExecutableDeployItem;
    static newModuleBytes(moduleBytes: Uint8Array, args: RuntimeArgs): ExecutableDeployItem;
    static newStoredContractByHash(hash: Uint8Array, entryPoint: string, args: RuntimeArgs): DeployUtil.ExecutableDeployItem;
    static newStoredContractByName(name: string, entryPoint: string, args: RuntimeArgs): DeployUtil.ExecutableDeployItem;
    static newStoredVersionContractByHash(hash: Uint8Array, version: number | null, entryPoint: string, args: RuntimeArgs): DeployUtil.ExecutableDeployItem;
    static newStoredVersionContractByName(name: string, version: number | null, entryPoint: string, args: RuntimeArgs): DeployUtil.ExecutableDeployItem;
    /**
     * Constructor for Transfer deploy item.
     * @param amount The number of motes to transfer
     * @param target URef of the target purse or the public key of target account. You could generate this public key from accountHex by CLPublicKey.fromHex
     * @param sourcePurse URef of the source purse. If this is omitted, the main purse of the account creating this \
     * transfer will be used as the source purse
     * @param id user-defined transfer id. This parameter is required.
     */
    static newTransfer(amount: BigNumberish, target: CLURef | CLPublicKey, sourcePurse: CLURef | null | undefined, id: BigNumberish): ExecutableDeployItem;
    /**
     * Constructor for Transfer deploy item without obligatory transfer-id.
     * @param amount The number of motes to transfer
     * @param target URef of the target purse or the public key of target account. You could generate this public key from accountHex by PublicKey.fromHex
     * @param sourcePurse URef of the source purse. If this is omitted, the main purse of the account creating this \
     * transfer will be used as the source purse
     * @param id user-defined transfer id. This parameter is optional.
     */
    static newTransferWithOptionalTransferId(amount: BigNumberish, target: CLURef | CLPublicKey, sourcePurse?: CLURef | null, id?: BigNumberish): DeployUtil.ExecutableDeployItem;
    /**
     * Constructor for Transfer deploy item using UniqAddress.
     * @param source PublicKey of source account
     * @param target UniqAddress of target account
     * @param amount The number of motes to transfer
     * @param paymentAmount the number of motes paying to execution engine
     * @param chainName Name of the chain, to avoid the `Deploy` from being accidentally or maliciously included in a different chain.
     * @param gasPrice Conversion rate between the cost of Wasm opcodes and the motes sent by the payment code.
     * @param ttl Time that the `Deploy` will remain valid for, in milliseconds. The default value is 1800000, which is 30 minutes
     * @param sourcePurse URef of the source purse. If this is omitted, the main purse of the account creating this \
     * transfer will be used as the source purse
     */
    static newTransferToUniqAddress(source: CLPublicKey, target: UniqAddress, amount: BigNumberish, paymentAmount: BigNumberish, chainName: string, gasPrice?: number, ttl?: number, sourcePurse?: CLURef): Deploy;
    isModuleBytes(): boolean;
    asModuleBytes(): ModuleBytes | undefined;
    isStoredContractByHash(): boolean;
    asStoredContractByHash(): StoredContractByHash | undefined;
    isStoredContractByName(): boolean;
    asStoredContractByName(): StoredContractByName | undefined;
    isStoredVersionContractByName(): boolean;
    asStoredVersionContractByName(): StoredVersionedContractByName | undefined;
    isStoredVersionContractByHash(): boolean;
    asStoredVersionContractByHash(): StoredVersionedContractByHash | undefined;
    isTransfer(): boolean;
    asTransfer(): Transfer | undefined;
}
/**
 * A deploy containing a smart contract along with the requester's signature(s).
 */
export declare class Deploy {
    hash: Uint8Array;
    header: DeployHeader;
    payment: ExecutableDeployItem;
    session: ExecutableDeployItem;
    approvals: Approval[];
    /**
     *
     * @param hash The DeployHash identifying this Deploy
     * @param header The deployHeader
     * @param payment The ExecutableDeployItem for payment code.
     * @param session the ExecutableDeployItem for session code.
     * @param approvals  An array of signature and public key of the signers, who approve this deploy
     */
    constructor(hash: Uint8Array, header: DeployHeader, payment: ExecutableDeployItem, session: ExecutableDeployItem, approvals: Approval[]);
    isTransfer(): boolean;
    isStandardPayment(): boolean;
    send(nodeUrl: string): Promise<string>;
    sign(keys: AsymmetricKey[]): Deploy;
}
/**
 * Serialize deployHeader into a array of bytes
 * @param deployHeader
 */
export declare const serializeHeader: (deployHeader: DeployHeader) => ToBytesResult;
/**
 * Serialize deployBody into a array of bytes
 * @param payment
 * @param session
 */
export declare const serializeBody: (payment: ExecutableDeployItem, session: ExecutableDeployItem) => Uint8Array;
export declare const serializeApprovals: (approvals: Approval[]) => Uint8Array;
/**
 * Supported contract type
 */
export declare enum ContractType {
    WASM = "WASM",
    Hash = "Hash",
    Name = "Name"
}
export declare class DeployParams {
    accountPublicKey: CLPublicKey;
    chainName: string;
    gasPrice: number;
    ttl: number;
    dependencies: Uint8Array[];
    timestamp?: number | undefined;
    /**
     * Container for `Deploy` construction options.
     * @param accountPublicKey
     * @param chainName Name of the chain, to avoid the `Deploy` from being accidentally or maliciously included in a different chain.
     * @param gasPrice Conversion rate between the cost of Wasm opcodes and the motes sent by the payment code.
     * @param ttl Time that the `Deploy` will remain valid for, in milliseconds. The default value is 1800000, which is 30 minutes
     * @param dependencies Hex-encoded `Deploy` hashes of deploys which must be executed before this one.
     * @param timestamp  If `timestamp` is empty, the current time will be used. Note that timestamp is UTC, not local.
     */
    constructor(accountPublicKey: CLPublicKey, chainName: string, gasPrice?: number, ttl?: number, dependencies?: Uint8Array[], timestamp?: number | undefined);
}
/**
 * Makes Deploy message
 */
export declare function makeDeploy(deployParam: DeployParams, session: ExecutableDeployItem, payment: ExecutableDeployItem): Deploy;
/**
 * Uses the provided key pair to sign the Deploy message
 *
 * @param deploy
 * @param signingKey the keyPair to sign deploy
 */
export declare const signDeploy: (deploy: Deploy, signingKey: AsymmetricKey) => Deploy;
/**
 * Sets the already generated Ed25519 signature for the Deploy message
 *
 * @param deploy
 * @param sig the Ed25519 signature
 * @param publicKey the public key used to generate the Ed25519 signature
 */
export declare const setSignature: (deploy: Deploy, sig: Uint8Array, publicKey: CLPublicKey) => Deploy;
/**
 * Standard payment code.
 *
 * @param paymentAmount the number of motes paying to execution engine
 */
export declare const standardPayment: (paymentAmount: BigNumberish) => DeployUtil.ExecutableDeployItem;
/**
 * Convert the deploy object to json
 *
 * @param deploy
 */
export declare const deployToJson: (deploy: Deploy) => {
    deploy: import("typedjson").JsonTypes;
};
/**
 * Convert the json to deploy object
 *
 * @param json
 */
export declare const deployFromJson: (json: any) => Result<Deploy, Error>;
export declare const addArgToDeploy: (deploy: Deploy, name: string, value: CLValue) => Deploy;
export declare const deploySizeInBytes: (deploy: Deploy) => number;
export declare const validateDeploy: (deploy: Deploy) => Result<Deploy, string>;
export declare const arrayEquals: (a: Uint8Array, b: Uint8Array) => boolean;
export declare const deployToBytes: (deploy: Deploy) => Uint8Array;
export {};
