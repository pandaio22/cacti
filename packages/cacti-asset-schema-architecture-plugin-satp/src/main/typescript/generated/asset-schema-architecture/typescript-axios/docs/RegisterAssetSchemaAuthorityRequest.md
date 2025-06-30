# RegisterAssetSchemaAuthorityRequest

A W3C-compliant JSON-LD object containing an X.509 certificate representing an Asset Schema Authority.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RegisterAssetSchemaAuthorityRequestContext**](RegisterAssetSchemaAuthorityRequestContext.md) |  | [default to undefined]
**id** | **string** | The decentralized identifier (DID) of the Asset Schema Authority. | [default to undefined]
**type** | **string** |  | [default to undefined]
**certificate** | **string** | The X.509 certificate (PEM-encoded, Base64). | [default to undefined]

## Example

```typescript
import { RegisterAssetSchemaAuthorityRequest } from './api';

const instance: RegisterAssetSchemaAuthorityRequest = {
    context,
    id,
    type,
    certificate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
