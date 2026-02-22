export const MON_LOYALTY_ABI = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "inputs": [], "name": "InsufficientContractBalance", "type": "error" },
    { "inputs": [], "name": "TransferFailed", "type": "error" },
    { "inputs": [], "name": "Unauthorized", "type": "error" },
    { "inputs": [], "name": "ZeroAddress", "type": "error" },
    { "inputs": [], "name": "ZeroAmount", "type": "error" },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "Deposited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "userId", "type": "string" }
        ],
        "name": "Settled",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "balance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "string", "name": "userId", "type": "string" }
        ],
        "name": "settle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    { "stateMutability": "payable", "type": "receive" }
];

export const MON_LOYALTY_BYTECODE = "0x6080604052348015600e575f5ffd5b505f80546001600160a01b031916331790556104a88061002d5f395ff3fe60806040526004361061004c575f3560e01c80638da5cb5b1461008c5780639b8a3f8a146100c7578063b69ef8a8146100e8578063d0e30db014610102578063f2fde38b1461010a575f5ffd5b366100885760405134815233907f2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c49060200160405180910390a2005b5f5ffd5b348015610097575f5ffd5b505f546100aa906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100d2575f5ffd5b506100e66100e136600461039a565b610129565b005b3480156100f3575f5ffd5b506040514781526020016100be565b6100e6610276565b348015610115575f5ffd5b506100e661012436600461041d565b6102d6565b5f546001600160a01b03163314610152576040516282b42960e81b815260040160405180910390fd5b6001600160a01b0384166101795760405163d92e233d60e01b815260040160405180910390fd5b825f0361019957604051631f2a200560e01b815260040160405180910390fd5b824710156101ba5760405163786e0a9960e01b815260040160405180910390fd5b5f846001600160a01b0316846040515f6040518083038185875af1925050503d805f8114610203576040519150601f19603f3d011682016040523d82523d5f602084013e610208565b606091505b505090508061022a576040516312171d8360e31b815260040160405180910390fd5b846001600160a01b03167fbb9898511c1aa5358b6af8ab20d180d13cc4761d82b18e78f55fe5e27d439c898585856040516102679392919061043d565b60405180910390a25050505050565b5f546001600160a01b0316331461029f576040516282b42960e81b815260040160405180910390fd5b60405134815233907f2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c49060200160405180910390a2565b5f546001600160a01b031633146102ff576040516282b42960e81b815260040160405180910390fd5b6001600160a01b0381166103265760405163d92e233d60e01b815260040160405180910390fd5b5f80546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a35f80546001600160a01b0319166001600160a01b0392909216919091179055565b80356001600160a01b0381168114610395575f5ffd5b919050565b5f5f5f5f606085870312156103ad575f5ffd5b6103b68561037f565b935060208501359250604085013567ffffffffffffffff8111156103d8575f5ffd5b8501601f810187136103e8575f5ffd5b803567ffffffffffffffff8111156103fe575f5ffd5b87602082840101111561040f575f5ffd5b949793965060200194505050565b5f6020828403121561042d575f5ffd5b6104368261037f565b9392505050565b83815260406020820152816040820152818360608301375f818301606090810191909152601f909201601f191601019291505056fea26469706673582212207c39b1dff6b9baa27b969da2dffd15ce7322d50d56f55fc6356e5c91046e50aa64736f6c63430008220033";
