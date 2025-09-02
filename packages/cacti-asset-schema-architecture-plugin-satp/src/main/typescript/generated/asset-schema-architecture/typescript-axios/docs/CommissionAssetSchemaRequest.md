# CommissionAssetSchemaRequest

RegisteredAssetSchema represents a persistable wrapper for an Asset Schema, including its DID Document and Verifiable Credential. 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**did** | **string** | The DID of this asset schema | [default to undefined]
**assetSchema** | [**CommissionAssetSchemaRequestAssetSchema**](CommissionAssetSchemaRequestAssetSchema.md) |  | [default to undefined]
**assetSchemaDidDocument** | [**CommissionAssetSchemaRequestAssetSchemaDidDocument**](CommissionAssetSchemaRequestAssetSchemaDidDocument.md) |  | [default to undefined]
**assetSchemaVerifiableCredential** | [**CommissionAssetSchemaRequestAssetSchemaVerifiableCredential**](CommissionAssetSchemaRequestAssetSchemaVerifiableCredential.md) |  | [default to undefined]

## Example

```typescript
import { CommissionAssetSchemaRequest } from './api';

const instance: CommissionAssetSchemaRequest = {
    did,
    assetSchema,
    assetSchemaDidDocument,
    assetSchemaVerifiableCredential,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
