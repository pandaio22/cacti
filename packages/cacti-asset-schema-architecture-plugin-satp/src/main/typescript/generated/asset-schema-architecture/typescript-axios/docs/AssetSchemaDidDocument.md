# AssetSchemaDidDocument

Structure of a valid Asset Schema DID Document (JSON-LD format)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**AssetSchemaDidDocumentContext**](AssetSchemaDidDocumentContext.md) |  | [default to undefined]
**id** | **string** | Unique identifier for the Asset Schema DID Document. | [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;DIDDocument\&quot; and \&quot;AssetSchemaDidDocument\&quot;.  | [default to undefined]
**verificationMethod** | [**Array&lt;AssetSchemaDidDocumentVerificationMethodInner&gt;**](AssetSchemaDidDocumentVerificationMethodInner.md) |  | [default to undefined]
**authentication** | **Array&lt;string&gt;** | List of verification method IDs allowed for authentication.  | [optional] [default to undefined]
**assertionMethod** | **Array&lt;string&gt;** | List of verification method IDs allowed for asserting claims or issuing VCs.  | [optional] [default to undefined]

## Example

```typescript
import { AssetSchemaDidDocument } from './api';

const instance: AssetSchemaDidDocument = {
    context,
    id,
    type,
    verificationMethod,
    authentication,
    assertionMethod,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
