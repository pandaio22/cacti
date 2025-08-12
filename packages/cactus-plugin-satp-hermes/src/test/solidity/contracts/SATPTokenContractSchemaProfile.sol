// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error noPermission(address adr);

/**
 * @title SATPTokenContract
 * The SATPTokenContract is a example costum ERC20 token contract.
 */
contract SATPTokenContract is AccessControl, ERC20 {

    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    string private _schemaId;


    constructor(address _owner) ERC20("SATPToken", "SATP") {
        _grantRole(OWNER_ROLE, _owner);
        _grantRole(BRIDGE_ROLE, _owner);
    }

    /**
     * @notice Mint creates new tokens with the given amount and assigns them to the owner.
     * @param account The account that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     * @return success A boolean that indicates if the operation was successful.
     */
    function mint(address account, uint256 amount) external onlyRole(BRIDGE_ROLE) returns (bool success) {
        _mint(account, amount);
        return true;
    }

    /**
     * @notice Burn destroys the given amount of tokens from the owner.
     * @param account The account that will have the tokens burned.
     * @param amount The amount of tokens to burn.
     * @return success A boolean that indicates if the operation was successful.
     */
    function burn(address account, uint256 amount) external onlyRole(BRIDGE_ROLE) returns (bool success) {
        _burn(account, amount);
        return true;
    }

    /**
     * @notice Checks if the given account has the given role.
     * @param account The account to check.
     * @return success A boolean that indicates if the account has the role.
     */
    function grantBridgeRole(address account) external onlyRole(OWNER_ROLE) returns (bool success) {
        _grantRole(BRIDGE_ROLE, account);
        return true;
    }
    
    /**
     * @notice Checks if the given account has the given role.
     * @param account The account to check.
     * @return success A boolean that indicates if the account has the role.
     */
    function hasBridgeRole(address account) external view returns (bool success) {
        if(hasRole(BRIDGE_ROLE, account)){
            return true;
        }     
        revert noPermission(account);
    }
    

    /**
    * @notice Sets the schema ID of the asset.
    * @param schemaId The schema ID to set.
    */
    function setSchemaId(string memory schemaId) external onlyRole(OWNER_ROLE) {
        _schemaId = schemaId;
    }

    /**
    * @notice Gets the schema ID of the asset.
    * @return schemaId The current schema ID.
    */
    function getSchemaId() external view returns (string memory schemaId) {
        return _schemaId;
    }

    /**
     * @notice Gets the schema ID of the asset.
     * @return string A string.
     */
    function getSchemaIdMock() external pure returns (string memory) {
        return "did:ipfs:QmRxbR5U8pw6bCtU3Gj3fjgn69zvQSScEVWkKUqY18trKj";
    }
}