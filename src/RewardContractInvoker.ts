import { NeonInvoker } from '@cityofzion/neon-invoker'
import { ContractInvocationMulti, Signer, Neo3Invoker, Arg, ContractInvocation } from '@cityofzion/neo3-invoker'
import Neon from "@cityofzion/neon-js";
import * as neonCore from "@cityofzion/neon-core";
import { RPCClient } from '@cityofzion/neon-core/lib/rpc';
import { networks } from "./config";
import {
    Neo3ApplicationLog,
    Neo3StackItem,
} from '@cityofzion/neo3-event-listener';

export default class RewardContractInvoker {
    private network: { [key: string]: any };
    private owner: neonCore.wallet.Account;
    private neonInvoker: Neo3Invoker;
    private rpcClient: RPCClient

    public constructor(network: string) {
        this.network = networks[network || process.env.SC_NETWORK];
    }

    public async init() {
        this.owner = Neon.create.account(this.network.owner_private_key);
        this.neonInvoker = await NeonInvoker.init(this.network.rpcUrl, this.owner);
        this.rpcClient = Neon.create.rpcClient(this.network.rpcUrl);
    }

    public async invokeFunction(operation: string, args?: Arg[], signer?: Partial<Signer>) {
        let contractInvocation: ContractInvocation = {
            scriptHash: this.network.reward_contract_script_hash,
            operation,
            abortOnFail: false,
        };

        if (args && args.length) {
            contractInvocation = { ...contractInvocation, args };
        }

        const invocations: ContractInvocation[] = [contractInvocation];

        let _signer: Signer = {
            scopes: "CalledByEntry"
        }

        if (signer && signer?.account) {
            const account = Neon.create.account(signer.account);
            _signer = { ..._signer, ...signer, account: account.scriptHash };
        }

        const signers: Signer[] = [_signer];

        const formattedRequest: ContractInvocationMulti = {
            invocations,
            signers,
        }
        const resp = await this.neonInvoker.invokeFunction(formattedRequest);

        return resp;
    }

    public async getApplicationLog(
        txId: string
    ): Promise<Neo3ApplicationLog> {

        let attempts = 0
        let error = null;
        do {
            try {
                return await this.rpcClient.getApplicationLog(txId);
            } catch (e) {
                error = new Error("Couldn't get application log")
            }
            attempts++
            await this.wait(1000)
        } while (attempts < 30)

        throw error
    }

    confirmStackTrue(txResult: Neo3ApplicationLog) {
        if (!txResult || !txResult.executions || txResult.executions.length === 0 || !txResult.executions[0].stack || txResult.executions[0].stack.length === 0) {
            throw new Error('Transaction failed. No stack found in transaction result')
        }
        const stack: Neo3StackItem = txResult.executions[0].stack[0]
        if (stack.value !== true) {
            throw new Error('Transaction failed. Stack value is not true')
        }
        return true;
    }

    public async getOwner() {
        return await this.invokeFunction("owner");
    }

    public async refund(rewardKey: string, adminSignerAddress?: string) {
        return await this.invokeFunction("refund", [{ type: "String", value: rewardKey }], { account: adminSignerAddress });
    }

    public async addAdmin(adminAddress: string) {
        return await this.invokeFunction("addAdmin", [{ type: "Hash160", value: adminAddress }]);
    }

    public async removeAdmin(adminAddress: string) {
        return await this.invokeFunction("removeAdmin", [{ type: "Hash160", value: adminAddress }]);
    }

    public async lockRewards(rewardKey: string, adminSignerAddress?: string) {
        return await this.invokeFunction("lockRewards", [{ type: "String", value: rewardKey }], { account: adminSignerAddress });
    }

    public async submitCitizens(rewardKey: string, citizens: string[], adminSignerAddress?: string) {
        return await this.invokeFunction("submitCitizens", [{ type: "String", value: rewardKey }, { type: "Array", value: [...citizens.map((c) => ({ type: "Hash160", value: c }))] }], { account: adminSignerAddress });
    }

    public async distributeRewards(rewardKey: string, top5citizens: string[], fullParticipantsCitizens: string[], adminSignerAddress?: string) {
        return await this.invokeFunction("distributeRewards", [{ type: "String", value: rewardKey }, { type: "Array", value: [...top5citizens.map((c) => ({ type: "Hash160", value: c }))] }, { type: "Array", value: [...fullParticipantsCitizens.map((c) => ({ type: "Hash160", value: c }))] }], { account: adminSignerAddress });
    }

    private wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

}