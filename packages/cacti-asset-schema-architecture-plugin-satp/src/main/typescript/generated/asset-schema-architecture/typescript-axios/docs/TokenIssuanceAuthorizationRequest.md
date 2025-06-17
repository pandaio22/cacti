# TokenIssuanceAuthorizationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**RequestTokenIssuanceAuthorizationRequestContext**](RequestTokenIssuanceAuthorizationRequestContext.md) |  | [default to undefined]
**asset_provider** | [**RequestTokenIssuanceAuthorizationRequestAssetProvider**](RequestTokenIssuanceAuthorizationRequestAssetProvider.md) |  | [default to undefined]
**schema_profile** | **string** |  | [default to undefined]
**network_id** | **string** |  | [default to undefined]
**proof** | [**RequestTokenIssuanceAuthorizationRequestProof**](RequestTokenIssuanceAuthorizationRequestProof.md) |  | [default to undefined]

## Example

```typescript
import { TokenIssuanceAuthorizationRequest } from './api';

const instance: TokenIssuanceAuthorizationRequest = {
    context,
    asset_provider,
    schema_profile,
    network_id,
    proof,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
