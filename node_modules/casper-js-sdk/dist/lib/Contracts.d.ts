import { CLPublicKey, CLValue } from '../index';
import { CasperClient } from './CasperClient';
import { Deploy } from './DeployUtil';
import { RuntimeArgs } from './RuntimeArgs';
import { AsymmetricKey } from './Keys';
import { StoredValue } from './StoredValue';
/**
 * Use blake2b to compute hash of ByteArray
 *
 * @param x
 */
export declare function byteHash(x: Uint8Array): Uint8Array;
export declare const contractHashToByteArray: (contractHash: string) => Uint8Array;
export declare class Contract {
    casperClient?: CasperClient | undefined;
    contractHash?: string;
    contractPackageHash?: string;
    constructor(casperClient?: CasperClient | undefined);
    setContractHash(contractHash: string, contractPackageHash?: string): void;
    install(wasm: Uint8Array, args: RuntimeArgs, paymentAmount: string, sender: CLPublicKey, chainName: string, signingKeys?: AsymmetricKey[]): Deploy;
    private checkSetup;
    callEntrypoint(entryPoint: string, args: RuntimeArgs, sender: CLPublicKey, chainName: string, paymentAmount: string, signingKeys?: AsymmetricKey[], ttl?: number): Deploy;
    queryContractData(path?: string[], casperClient?: CasperClient, stateRootHash?: string): Promise<StoredValue>;
    queryContractDictionary(dictionaryName: string, dictionaryItemKey: string, stateRootHash?: string, casperClient?: CasperClient): Promise<CLValue>;
}
export declare const toCLMap: (map: Map<string, string>) => import("..").CLMap<CLValue, CLValue>;
export declare const fromCLMap: (map: [CLValue, CLValue][]) => Map<any, any>;
