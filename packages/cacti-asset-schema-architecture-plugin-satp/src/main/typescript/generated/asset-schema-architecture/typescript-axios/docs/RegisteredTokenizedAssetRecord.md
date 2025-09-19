# RegisteredTokenizedAssetRecord

RegisteredTokenizedAssetRecord represents a persistable wrapper for a Tokenized Asset Record, including its DID Document and Verifiable Credential. 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**did** | **string** | The DID of this tokenized asset record | [default to undefined]
**tokenizedAssetRecord** | [**CommissionTokenizedAssetRecordRequestTokenizedAssetRecord**](CommissionTokenizedAssetRecordRequestTokenizedAssetRecord.md) |  | [default to undefined]
**tokenizedAssetRecordDidDocument** | [**CommissionTokenizedAssetRecordRequestTokenizedAssetRecordDidDocument**](CommissionTokenizedAssetRecordRequestTokenizedAssetRecordDidDocument.md) |  | [default to undefined]
**tokenizedAssetRecordVerifiableCredential** | [**CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredential**](CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredential.md) |  | [default to undefined]

## Example

```typescript
import { RegisteredTokenizedAssetRecord } from './api';

const instance: RegisteredTokenizedAssetRecord = {
    did,
    tokenizedAssetRecord,
    tokenizedAssetRecordDidDocument,
    tokenizedAssetRecordVerifiableCredential,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
