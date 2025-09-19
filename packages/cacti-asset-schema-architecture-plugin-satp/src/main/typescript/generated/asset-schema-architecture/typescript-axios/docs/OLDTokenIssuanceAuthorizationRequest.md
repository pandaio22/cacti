# OLDTokenIssuanceAuthorizationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequestContext**](RegisterTokenIssuanceAuthorizationRequestCredentialSubjectTokenIssuanceAuthorizationRequestContext.md) |  | [default to undefined]
**asset_provider** | [**OLDTokenIssuanceAuthorizationRequestAssetProvider**](OLDTokenIssuanceAuthorizationRequestAssetProvider.md) |  | [default to undefined]
**schema_profile** | **string** |  | [default to undefined]
**network_id** | **string** |  | [default to undefined]
**proof** | [**SchemaProfileCertification200ResponseProof**](SchemaProfileCertification200ResponseProof.md) |  | [default to undefined]

## Example

```typescript
import { OLDTokenIssuanceAuthorizationRequest } from './api';

const instance: OLDTokenIssuanceAuthorizationRequest = {
    context,
    asset_provider,
    schema_profile,
    network_id,
    proof,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
