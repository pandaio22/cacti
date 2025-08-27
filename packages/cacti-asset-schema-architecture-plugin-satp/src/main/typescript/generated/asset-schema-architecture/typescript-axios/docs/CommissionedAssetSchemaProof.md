# CommissionedAssetSchemaProof


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** |  | [optional] [default to undefined]
**verificationMethod** | **string** |  | [optional] [default to undefined]
**created** | **string** |  | [optional] [default to undefined]
**proofPurpose** | **string** |  | [optional] [default to undefined]
**proofValue** | **string** | The cryptographic proof value, typically a JWS or similar signature.  | [optional] [default to undefined]

## Example

```typescript
import { CommissionedAssetSchemaProof } from './api';

const instance: CommissionedAssetSchemaProof = {
    type,
    verificationMethod,
    created,
    proofPurpose,
    proofValue,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
