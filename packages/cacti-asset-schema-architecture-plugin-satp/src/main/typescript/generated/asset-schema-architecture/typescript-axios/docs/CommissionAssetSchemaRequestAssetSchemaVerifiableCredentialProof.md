# CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialProof


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** |  | [optional] [default to undefined]
**verificationMethod** | **string** |  | [optional] [default to undefined]
**cryptosuite** | **string** | The cryptographic suite used for signing, e.g., \&quot;eddsa-rdfc-2022\&quot;.  | [optional] [default to undefined]
**created** | **string** |  | [optional] [default to undefined]
**proofPurpose** | **string** |  | [optional] [default to undefined]
**proofValue** | **string** | The cryptographic proof value, typically a JWS or similar signature.  | [optional] [default to undefined]

## Example

```typescript
import { CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialProof } from './api';

const instance: CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialProof = {
    type,
    verificationMethod,
    cryptosuite,
    created,
    proofPurpose,
    proofValue,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
