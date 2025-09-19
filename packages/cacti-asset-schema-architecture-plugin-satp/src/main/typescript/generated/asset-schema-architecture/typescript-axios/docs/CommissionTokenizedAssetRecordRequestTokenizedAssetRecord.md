# CommissionTokenizedAssetRecordRequestTokenizedAssetRecord

Structure of a valid Tokenized Asset Record (JSON-LD format)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialContext**](CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialContext.md) |  | [default to undefined]
**token_issuance_authorization** | [**CommissionTokenizedAssetRecordRequestTokenizedAssetRecordTokenIssuanceAuthorization**](CommissionTokenizedAssetRecordRequestTokenizedAssetRecordTokenIssuanceAuthorization.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CommissionTokenizedAssetRecordRequestTokenizedAssetRecord } from './api';

const instance: CommissionTokenizedAssetRecordRequestTokenizedAssetRecord = {
    context,
    token_issuance_authorization,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
