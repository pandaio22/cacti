# CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredential

Structure of a valid TokenizedAssetRecord Verifiable Credential (JSON-LD format)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialContext**](CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialContext.md) |  | [optional] [default to undefined]
**id** | **string** | Unique identifier for the TokenizedAssetRecord Verifiable Credential. | [optional] [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;VerifiableCredential\&quot; and \&quot;TokenizedAssetRecordVerifiableCredential\&quot;.  | [optional] [default to undefined]
**issuer** | **string** | DID or URI of the Asset Provider issuing this VC. | [optional] [default to undefined]
**validFrom** | **string** | Timestamp stating VC starting validity. | [optional] [default to undefined]
**issuanceDate** | **string** | Timestamp when the VC was issued. | [optional] [default to undefined]
**credentialSubject** | [**CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredentialCredentialSubject**](CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredentialCredentialSubject.md) |  | [optional] [default to undefined]
**proof** | [**CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialProof**](CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialProof.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredential } from './api';

const instance: CommissionTokenizedAssetRecordRequestTokenizedAssetRecordVerifiableCredential = {
    context,
    id,
    type,
    issuer,
    validFrom,
    issuanceDate,
    credentialSubject,
    proof,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
