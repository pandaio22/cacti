# RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequest

Contains the Token Issuance Authorization Request VC issued by the Asset Provider. 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequestContext**](RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequestContext.md) |  | [default to undefined]
**id** | **string** |  | [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;VerifiableCredential\&quot; and \&quot;TokenIssuanceAuthorizationRequest\&quot;.  | [default to undefined]
**issuer** | **string** | DID or URI of the Asset Provider issuing this TIAR.  | [default to undefined]
**validFrom** | **string** |  | [optional] [default to undefined]
**issuanceDate** | **string** |  | [default to undefined]
**validUntil** | **string** |  | [optional] [default to undefined]
**credentialSubject** | [**RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequestCredentialSubject**](RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequestCredentialSubject.md) |  | [default to undefined]
**proof** | [**RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequestProof**](RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequestProof.md) |  | [default to undefined]

## Example

```typescript
import { RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequest } from './api';

const instance: RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequest = {
    context,
    id,
    type,
    issuer,
    validFrom,
    issuanceDate,
    validUntil,
    credentialSubject,
    proof,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
