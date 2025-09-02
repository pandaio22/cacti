# CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredentialCredentialSubject


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | DID or URI of the TokenizedAssetRecord. | [optional] [default to undefined]
**name** | **string** | Human-readable name of the TokenizedAssetRecord. | [optional] [default to undefined]
**version** | **string** | Version of the TokenizedAssetRecord. | [optional] [default to undefined]
**hash** | **string** | Unique hash representing the TokenizedAssetRecord, typically a CID or similar identifier.  | [optional] [default to undefined]
**nonce** | **string** | Unique number used once to ensure freshness, preventing replay attacks.  | [optional] [default to undefined]
**createdBy** | **string** | DID or URI of the entity that created the TokenizedAssetRecord. | [optional] [default to undefined]
**schemaProfile** | [**CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredentialCredentialSubjectSchemaProfile**](CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredentialCredentialSubjectSchemaProfile.md) |  | [optional] [default to undefined]
**tokenizedAssetRecord** | [**CommissionTokenizedAssetRecordRequestTokenizedAssetRecord**](CommissionTokenizedAssetRecordRequestTokenizedAssetRecord.md) |  | [optional] [default to undefined]
**tokenIssuanceAuthorization** | [**RegisterTokenIssuanceAuthorizationRequest**](RegisterTokenIssuanceAuthorizationRequest.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredentialCredentialSubject } from './api';

const instance: CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredentialCredentialSubject = {
    id,
    name,
    version,
    hash,
    nonce,
    createdBy,
    schemaProfile,
    tokenizedAssetRecord,
    tokenIssuanceAuthorization,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
