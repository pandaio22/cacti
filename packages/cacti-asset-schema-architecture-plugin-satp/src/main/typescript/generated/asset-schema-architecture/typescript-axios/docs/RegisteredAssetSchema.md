# RegisteredAssetSchema

RegisteredAssetSchema represents a persistable wrapper for an Asset Schema, including its DID Document and Verifiable Credential. 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**did** | **string** | The DID of this asset schema | [default to undefined]
**assetSchema** | [**CommissionAssetSchemaRequestAssetSchema**](CommissionAssetSchemaRequestAssetSchema.md) |  | [default to undefined]
**assetSchemaDidDocument** | [**AssetSchemaCertificationRequestAssetSchemaDidDocument**](AssetSchemaCertificationRequestAssetSchemaDidDocument.md) |  | [default to undefined]
**assetSchemaVerifiableCredential** | [**RegisteredAssetSchemaAssetSchemaVerifiableCredential**](RegisteredAssetSchemaAssetSchemaVerifiableCredential.md) |  | [default to undefined]

## Example

```typescript
import { RegisteredAssetSchema } from './api';

const instance: RegisteredAssetSchema = {
    did,
    assetSchema,
    assetSchemaDidDocument,
    assetSchemaVerifiableCredential,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
