# rewards-contract-invoker

## Description

This project is a reward contract invoker. With thanks to GrantShares for providing us with a grant to develop web3 features for Voxiberate.

## Installation

1. Clone the repository.
2. Install the dependencies by running the following command:
   ```
   npm install
   ```

## Usage

1. Import the `RewardContractInvoker` class from the `RewardContractInvoker.ts` file.
2. Create an instance of the `RewardContractInvoker` class with the desired network.
3. Initialize the invoker by calling the `init` method.
4. Use the various methods provided by the `RewardContractInvoker` class to interact with the reward contract.

## Examples

Here are some examples of how to use the `RewardContractInvoker` class:

```typescript
// Create an instance of the RewardContractInvoker class
const invoker = new RewardContractInvoker('testnet');

// Initialize the invoker
await invoker.init();

// Invoke a function on the reward contract
const result = await invoker.invokeFunction('refund', [{ type: 'String', value: 'rewardKey' }]);

console.log(result);
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions to the Voxiberate Rewards Contract are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## Authors

- WAUIO
