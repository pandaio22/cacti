# OLDTokenIssuanceAuthorization


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RegisterTokenIssuanceAuthorizationRequestContext**](RegisterTokenIssuanceAuthorizationRequestContext.md) |  | [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;VerifiablePresentation\&quot; and optionally \&quot;TokenIssuanceAuthorization\&quot;.  | [default to undefined]
**issuer** | **string** | DID or URI of the Asset Schema Authority issuing (signing) this TIA VP.  | [default to undefined]
**holder** | **string** | DID or URI of the Asset Provider for whom this TIA VP is issued.  | [default to undefined]
**verifiableCredential** | [**Array&lt;RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInner&gt;**](RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInner.md) | Contains the Token Issuance Authorization Request VC issued by the Asset Provider.  | [default to undefined]
**proof** | [**OLDTokenIssuanceAuthorizationProof**](OLDTokenIssuanceAuthorizationProof.md) |  | [default to undefined]

## Example

```typescript
import { OLDTokenIssuanceAuthorization } from './api';

const instance: OLDTokenIssuanceAuthorization = {
    context,
    type,
    issuer,
    holder,
    verifiableCredential,
    proof,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
