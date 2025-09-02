# CommissionAssetSchemaRequestAssetSchemaVerifiableCredential

Structure of a valid Asset Schema Verifiable Credential (JSON-LD format)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialContext**](CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialContext.md) |  | [optional] [default to undefined]
**id** | **string** | Unique identifier for the Asset Schema Verifiable Credential. | [optional] [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;VerifiableCredential\&quot; and \&quot;AssetSchemaVerifiableCredential\&quot;.  | [optional] [default to undefined]
**issuer** | **string** | DID or URI of the Asset Schema Authority issuing this VC. | [optional] [default to undefined]
**validFrom** | **string** | Timestamp stating VC starting validity. | [optional] [default to undefined]
**issuanceDate** | **string** | Timestamp when the VC was issued. | [optional] [default to undefined]
**credentialSubject** | [**CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialCredentialSubject**](CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialCredentialSubject.md) |  | [optional] [default to undefined]
**proof** | [**CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialProof**](CommissionAssetSchemaRequestAssetSchemaVerifiableCredentialProof.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CommissionAssetSchemaRequestAssetSchemaVerifiableCredential } from './api';

const instance: CommissionAssetSchemaRequestAssetSchemaVerifiableCredential = {
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
