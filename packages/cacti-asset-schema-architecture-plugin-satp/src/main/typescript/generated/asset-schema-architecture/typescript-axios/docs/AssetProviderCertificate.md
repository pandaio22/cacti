# AssetProviderCertificate

A W3C-compliant JSON-LD object containing an X.509 certificate representing an Asset Provider.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RegisterAssetProviderRequestContext**](RegisterAssetProviderRequestContext.md) |  | [default to undefined]
**id** | **string** | The decentralized identifier (DID) of the Asset Provider. | [default to undefined]
**type** | **string** |  | [default to undefined]
**certificate** | **string** | The X.509 certificate (PEM-encoded, Base64). | [default to undefined]

## Example

```typescript
import { AssetProviderCertificate } from './api';

const instance: AssetProviderCertificate = {
    context,
    id,
    type,
    certificate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
