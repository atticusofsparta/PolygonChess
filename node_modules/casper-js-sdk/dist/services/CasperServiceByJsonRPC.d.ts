import { Client } from '@open-rpc/client-js';
import { DeployUtil, CLPublicKey } from '..';
import { StoredValue, Transfers } from '../lib/StoredValue';
import { BigNumber } from '@ethersproject/bignumber';
import { SafeEventEmitterProvider } from './ProviderTransport';
interface RpcResult {
    api_version: string;
}
interface Peer {
    node_id: string;
    address: string;
}
export interface GetPeersResult extends RpcResult {
    peers: Peer[];
}
interface LastAddedBlockInfo {
    hash: string;
    timestamp: string;
    era_id: number;
    height: number;
    state_root_hash: string;
    creator: string;
}
export interface GetStatusResult extends GetPeersResult {
    last_added_block_info: LastAddedBlockInfo;
    build_version: string;
}
export interface GetStateRootHashResult extends RpcResult {
    state_root_hash: string;
}
interface ExecutionResultBody {
    cost: number;
    error_message?: string | null;
    transfers: string[];
}
export interface ExecutionResult {
    Success?: ExecutionResultBody;
    Failure?: ExecutionResultBody;
}
export interface JsonExecutionResult {
    block_hash: JsonBlockHash;
    result: ExecutionResult;
}
export interface GetDeployResult extends RpcResult {
    deploy: JsonDeploy;
    execution_results: JsonExecutionResult[];
}
export interface GetBlockResult extends RpcResult {
    block: JsonBlock | null;
}
declare type JsonBlockHash = string;
declare type JsonDeployHash = string;
export interface JsonSystemTransaction {
    Slash?: string;
    Reward?: Record<string, number>;
}
interface JsonDeployHeader {
    account: string;
    timestamp: number;
    ttl: number;
    gas_price: number;
    body_hash: string;
    dependencies: JsonDeployHash[];
    chain_name: string;
}
interface JsonExecutableDeployItem {
}
interface JsonApproval {
    signer: string;
    signature: string;
}
export interface JsonDeploy {
    hash: JsonDeployHash;
    header: JsonDeployHeader;
    payment: JsonExecutableDeployItem;
    session: JsonExecutableDeployItem;
    approvals: JsonApproval[];
}
export interface JsonHeader {
    parent_hash: string;
    state_root_hash: string;
    body_hash: string;
    deploy_hashes: string[];
    random_bit: boolean;
    switch_block: boolean;
    timestamp: number;
    system_transactions: JsonSystemTransaction[];
    era_id: number;
    height: number;
    proposer: string;
    protocol_version: string;
}
export interface JsonBlock {
    hash: JsonBlockHash;
    header: JsonHeader;
    proofs: string[];
}
export interface BidInfo {
    bonding_purse: string;
    staked_amount: string;
    delegation_rate: number;
    funds_locked: null | string;
}
export interface ValidatorWeight {
    public_key: string;
    weight: string;
}
export declare class EraSummary {
    blockHash: string;
    eraId: number;
    StoredValue: StoredValue;
    stateRootHash: string;
}
export interface EraValidators {
    era_id: number;
    validator_weights: ValidatorWeight[];
}
export interface Bid {
    bonding_purse: string;
    staked_amount: string;
    delegation_rate: number;
    reward: string;
    delegators: Delegators[];
}
export interface Delegators {
    bonding_purse: string;
    delegatee: string;
    staked_amount: string;
    public_key: string;
}
export interface DelegatorInfo {
    bonding_purse: string;
    delegatee: string;
    reward: string;
    staked_amount: string;
}
export interface ValidatorBid {
    public_key: string;
    bid: Bid;
}
export interface AuctionState {
    state_root_hash: string;
    block_height: number;
    era_validators: EraValidators[];
    bids: ValidatorBid[];
}
export interface ValidatorsInfoResult extends RpcResult {
    api_version: string;
    auction_state: AuctionState;
}
export declare class CasperServiceByJsonRPC {
    protected client: Client;
    constructor(provider: string | SafeEventEmitterProvider);
    /**
     * Get information about a single deploy by hash.
     *
     * @param deployHashBase16
     */
    getDeployInfo(deployHashBase16: string): Promise<GetDeployResult>;
    getBlockInfo(blockHashBase16: JsonBlockHash): Promise<GetBlockResult>;
    getBlockInfoByHeight(height: number): Promise<GetBlockResult>;
    getLatestBlockInfo(): Promise<GetBlockResult>;
    getPeers(): Promise<GetPeersResult>;
    getStatus(): Promise<GetStatusResult>;
    getValidatorsInfo(): Promise<ValidatorsInfoResult>;
    getValidatorsInfoByBlockHeight(blockHeight: number): Promise<ValidatorsInfoResult>;
    /**
     * Get the reference to the balance so we can cache it.
     */
    getAccountBalanceUrefByPublicKeyHash(stateRootHash: string, accountHash: string): Promise<string>;
    /**
     * Get the reference to the balance so we can cache it.
     */
    getAccountBalanceUrefByPublicKey(stateRootHash: string, publicKey: CLPublicKey): Promise<string>;
    getAccountBalance(stateRootHash: string, balanceUref: string): Promise<BigNumber>;
    getStateRootHash(blockHashBase16?: JsonBlockHash): Promise<string>;
    /**
     * get global state item
     * @param stateRootHash
     * @param key
     * @param path
     */
    getBlockState(stateRootHash: string, key: string, path: string[]): Promise<StoredValue>;
    deploy(signedDeploy: DeployUtil.Deploy): Promise<any>;
    /**
     * Retrieves all transfers for a block from the network
     * @param blockIdentifier Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used. If not provided it will retrieve by latest block.
     */
    getBlockTransfers(blockHash?: string): Promise<Transfers>;
    /**
     * Retrieve era information by block hash.
     * @param blockIdentifier Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used. If not provided it will retrieve by latest block.
     */
    getEraInfoBySwitchBlock(blockHash?: string): Promise<EraSummary>;
    /**
     * Retrieve era information by block height
     * @param blockHeight
     */
    getEraInfoBySwitchBlockHeight(height: number): Promise<EraSummary>;
    /**
     * get dictionary item by URef
     * @param stateRootHash
     * @param dictionaryItemKey
     * @param seedUref
     */
    getDictionaryItemByURef(stateRootHash: string, dictionaryItemKey: string, seedUref: string, { rawData }?: {
        rawData: boolean;
    }): Promise<StoredValue>;
    /**
     * get dictionary item by name
     * @param stateRootHash
     * @param dictionaryItemKey
     */
    getDictionaryItemByName(stateRootHash: string, contractHash: string, dictionaryName: string, dictionaryItemKey: string, { rawData }?: {
        rawData: boolean;
    }): Promise<StoredValue>;
}
export {};
