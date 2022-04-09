/**
 * Provide methods to communicate with [CasperLabs Signer Extension](https://github.com/casper-ecosystem/signer).
 * Works only on browser.
 *
 * @packageDocumentation
 */
import { JsonTypes } from 'typedjson';
import { CasperLabsHelper, SignerTestingHelper } from '../@types/casperlabsSigner';
declare global {
    interface Window {
        casperlabsHelper: CasperLabsHelper;
        signerTestingHelper: SignerTestingHelper;
    }
}
/**
 * Returns Signer version
 */
export declare const getVersion: () => Promise<string>;
/**
 * Check whether CasperLabs Signer extension is connected
 */
export declare const isConnected: () => Promise<boolean>;
/**
 * Attempt connection to Signer
 */
export declare const sendConnectionRequest: () => void;
/**
 * **Deprecated** in favour of `getActivePublicKey()`.
 * Returns `base64` encoded public key of currently selected account.
 *
 * @throws Error if haven't connected to CasperLabs Signer browser extension.
 */
export declare const getSelectedPublicKeyBase64: () => Promise<string>;
/**
 * Retrieve the active public key.
 *
 * @returns {string} Hex-encoded public key with algorithm prefix.
 */
export declare const getActivePublicKey: () => Promise<string>;
/**
 * Send Deploy in JSON format to Signer extension to be signed.
 *
 * @param deploy - deploy in JSON format
 * @param signingPublicKeyHex - Hex-formatted public key. The corresponding secret key is used to sign the deploy.
 * @param {string} [targetPublicKeyHex] - Hex-formatted public key.
 * If the `target` in the deploy is an account hash this can be used to verify it and display the hex-formatted public key in the UI.
 *
 * @throws Errors if the Signer extension is not connected.
 * @throws Errors if signingPublicKeyHex is not available or does not match the Active Key in the Signer.
 * @throws Errors if targetPublicKeyHex is not the same as the key (or corresponding account hash) that is used as target in deploy.
 */
export declare const sign: (deploy: {
    deploy: JsonTypes;
}, signingPublicKeyHex: string, targetPublicKeyHex?: string) => Promise<{
    deploy: JsonTypes;
}>;
export declare const signMessage: (message: string, signingPublicKey: string) => Promise<string>;
export declare const disconnectFromSite: () => void;
export declare const forceConnection: () => void;
export declare const forceDisconnect: () => void;
export declare const hasCreatedVault: () => Promise<boolean>;
export declare const resetExistingVault: () => Promise<void>;
export declare const createNewVault: (password: string) => Promise<void>;
export declare const createTestAccount: (name: string, privateKey: string) => Promise<void>;
export declare const getToSignMessageID: () => Promise<number | null>;
export declare const signTestDeploy: (msgId: number) => Promise<void>;
