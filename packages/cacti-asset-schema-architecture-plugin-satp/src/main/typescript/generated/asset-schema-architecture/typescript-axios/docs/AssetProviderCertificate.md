# AssetProviderCertificate

A W3C-compliant JSON-LD object containing a DID Document representing an Asset Provider.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RegisterAssetSchemaAuthorityRequestContext**](RegisterAssetSchemaAuthorityRequestContext.md) |  | [default to undefined]
**id** | **string** | The decentralized identifier (DID) of the Asset Provider. | [default to undefined]
**entity** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]

## Example

```typescript
import { AssetProviderCertificate } from './api';

const instance: AssetProviderCertificate = {
    context,
    id,
    entity,
    name,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
