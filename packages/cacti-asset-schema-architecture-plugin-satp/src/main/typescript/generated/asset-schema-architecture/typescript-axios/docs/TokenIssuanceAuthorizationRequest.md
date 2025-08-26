# TokenIssuanceAuthorizationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerContext**](RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerContext.md) |  | [default to undefined]
**id** | **string** |  | [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;VerifiableCredential\&quot; and \&quot;TokenIssuanceAuthorizationRequest\&quot;.  | [default to undefined]
**issuer** | **string** | DID or URI of the Asset Provider issuing this TIAR.  | [default to undefined]
**validFrom** | **string** |  | [optional] [default to undefined]
**issuanceDate** | **string** |  | [default to undefined]
**validUntil** | **string** |  | [optional] [default to undefined]
**credentialSubject** | [**RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerCredentialSubject**](RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerCredentialSubject.md) |  | [default to undefined]
**proof** | [**RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerProof**](RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInnerProof.md) |  | [default to undefined]

## Example

```typescript
import { TokenIssuanceAuthorizationRequest } from './api';

const instance: TokenIssuanceAuthorizationRequest = {
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
