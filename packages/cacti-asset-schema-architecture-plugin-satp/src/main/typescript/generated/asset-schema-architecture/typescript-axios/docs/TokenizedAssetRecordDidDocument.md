# TokenizedAssetRecordDidDocument

Structure of a valid TokenizedAssetRecord DID Document (JSON-LD format)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**CommissionAssetSchemaRequestAssetSchemaDidDocumentContext**](CommissionAssetSchemaRequestAssetSchemaDidDocumentContext.md) |  | [default to undefined]
**id** | **string** | Unique identifier for the TokenizedAssetRecord DID Document. | [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;DIDDocument\&quot; and \&quot;TokenizedAssetRecordDidDocument\&quot;.  | [optional] [default to undefined]
**verificationMethod** | [**Array&lt;CommissionTokenizedAssetRecordRequestTokenizedAssetRecordDidDocumentVerificationMethodInner&gt;**](CommissionTokenizedAssetRecordRequestTokenizedAssetRecordDidDocumentVerificationMethodInner.md) |  | [default to undefined]
**authentication** | **Array&lt;string&gt;** | List of verification method IDs allowed for authentication.  | [optional] [default to undefined]
**assertionMethod** | **Array&lt;string&gt;** | List of verification method IDs allowed for asserting claims or issuing VCs.  | [optional] [default to undefined]

## Example

```typescript
import { TokenizedAssetRecordDidDocument } from './api';

const instance: TokenizedAssetRecordDidDocument = {
    context,
    id,
    type,
    verificationMethod,
    authentication,
    assertionMethod,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
