# RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerProof


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** |  | [default to undefined]
**verificationMethod** | **string** |  | [default to undefined]
**cryptosuite** | **string** | The cryptographic suite used for signing, e.g., \&quot;eddsa-rdfc-2022\&quot;.  | [default to undefined]
**created** | **string** |  | [default to undefined]
**proofPurpose** | **string** |  | [default to undefined]
**proofValue** | **string** | The cryptographic proof value, typically a JWS or similar signature.  | [optional] [default to undefined]

## Example

```typescript
import { RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerProof } from './api';

const instance: RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerProof = {
    type,
    verificationMethod,
    cryptosuite,
    created,
    proofPurpose,
    proofValue,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
