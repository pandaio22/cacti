# TokenIssuanceAuthorization


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RegisterTokenIssuanceAuthorizationRequestContext**](RegisterTokenIssuanceAuthorizationRequestContext.md) |  | [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;VerifiablePresentation\&quot; and optionally \&quot;TokenIssuanceAuthorization\&quot;.  | [default to undefined]
**issuer** | **string** | DID or URI of the Asset Schema Authority issuing (signing) this TIA VP.  | [default to undefined]
**issuanceDate** | **string** | Timestamp when the VC was issued. | [optional] [default to undefined]
**credentialSubject** | [**RegisterTokenIssuanceAuthorizationRequestCredentialSubject**](RegisterTokenIssuanceAuthorizationRequestCredentialSubject.md) |  | [optional] [default to undefined]
**verifiableCredential** | [**Array&lt;RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInner&gt;**](RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInner.md) | Contains the Token Issuance Authorization Request VC issued by the Asset Provider.  | [optional] [default to undefined]
**proof** | [**RegisterTokenIssuanceAuthorizationRequestProof**](RegisterTokenIssuanceAuthorizationRequestProof.md) |  | [default to undefined]

## Example

```typescript
import { TokenIssuanceAuthorization } from './api';

const instance: TokenIssuanceAuthorization = {
    context,
    id,
    type,
    issuer,
    issuanceDate,
    credentialSubject,
    verifiableCredential,
    proof,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
