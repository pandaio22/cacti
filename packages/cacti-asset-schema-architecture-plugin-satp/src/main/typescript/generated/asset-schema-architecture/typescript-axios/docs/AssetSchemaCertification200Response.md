# AssetSchemaCertification200Response

Structure of a commissioned Asset Schema Verifiable Credential (JSON-LD format)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**CommissionSchemaProfileRequestSchemaProfileContext**](CommissionSchemaProfileRequestSchemaProfileContext.md) |  | [optional] [default to undefined]
**id** | **string** | Unique identifier for the Asset Schema Verifiable Credential. | [optional] [default to undefined]
**type** | **Array&lt;string&gt;** | Includes \&quot;VerifiableCredential\&quot; and \&quot;AssetSchemaVerifiableCredential\&quot;.  | [optional] [default to undefined]
**issuer** | **string** | DID or URI of the Asset Schema Authority issuing this VC. | [optional] [default to undefined]
**validFrom** | **string** | Timestamp stating VC starting validity. | [optional] [default to undefined]
**issuanceDate** | **string** | Timestamp when the VC was issued. | [optional] [default to undefined]
**credentialSubject** | [**AssetSchemaCertification200ResponseCredentialSubject**](AssetSchemaCertification200ResponseCredentialSubject.md) |  | [optional] [default to undefined]
**proof** | [**AssetSchemaCertification200ResponseProof**](AssetSchemaCertification200ResponseProof.md) |  | [optional] [default to undefined]

## Example

```typescript
import { AssetSchemaCertification200Response } from './api';

const instance: AssetSchemaCertification200Response = {
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
