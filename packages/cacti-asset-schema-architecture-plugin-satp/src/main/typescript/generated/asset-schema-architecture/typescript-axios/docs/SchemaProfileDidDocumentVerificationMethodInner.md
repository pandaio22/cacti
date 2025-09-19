# SchemaProfileDidDocumentVerificationMethodInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Identifier for the verification method. | [default to undefined]
**type** | **string** | Type of verification method. | [default to undefined]
**controller** | **string** | DID of the controller of this Schema Profile DID. | [default to undefined]
**publicKeyMultibase** | **string** | Public key of the controller. | [optional] [default to undefined]

## Example

```typescript
import { SchemaProfileDidDocumentVerificationMethodInner } from './api';

const instance: SchemaProfileDidDocumentVerificationMethodInner = {
    id,
    type,
    controller,
    publicKeyMultibase,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
