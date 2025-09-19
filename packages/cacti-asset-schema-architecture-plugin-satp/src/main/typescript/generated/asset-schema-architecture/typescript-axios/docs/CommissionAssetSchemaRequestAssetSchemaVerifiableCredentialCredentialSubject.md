# CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialCredentialSubject


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | DID or URI of the Asset Schema. | [optional] [default to undefined]
**name** | **string** | Human-readable name of the Asset Schema. | [optional] [default to undefined]
**version** | **string** | Version of the Asset Schema. | [optional] [default to undefined]
**hash** | **string** | Unique hash representing the Asset Schema, typically a CID or similar identifier.  | [optional] [default to undefined]
**nonce** | **string** | Unique number used once to ensure freshness, preventing replay attacks.  | [optional] [default to undefined]
**createdBy** | **string** | DID or URI of the entity that created the Asset Schema. | [optional] [default to undefined]
**asset_schema** | [**CommissionAssetSchemaRequestAssetSchema**](CommissionAssetSchemaRequestAssetSchema.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialCredentialSubject } from './api';

const instance: CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialCredentialSubject = {
    id,
    name,
    version,
    hash,
    nonce,
    createdBy,
    asset_schema,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
