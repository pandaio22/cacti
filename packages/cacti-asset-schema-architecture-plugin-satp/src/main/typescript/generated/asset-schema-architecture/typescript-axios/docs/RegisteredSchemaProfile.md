# RegisteredSchemaProfile

RegisteredSchemaProfile represents a persistable wrapper for a Schema Profile, including its DID Document and Verifiable Credential. 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**did** | **string** | The DID of this schema profile | [default to undefined]
**schemaProfile** | [**CommissionSchemaProfileRequestSchemaProfile**](CommissionSchemaProfileRequestSchemaProfile.md) |  | [default to undefined]
**schemaProfileDidDocument** | [**SchemaProfileCertificationRequestSchemaProfileDidDocument**](SchemaProfileCertificationRequestSchemaProfileDidDocument.md) |  | [default to undefined]
**schemaProfileVerifiableCredential** | [**RegisteredSchemaProfileSchemaProfileVerifiableCredential**](RegisteredSchemaProfileSchemaProfileVerifiableCredential.md) |  | [default to undefined]

## Example

```typescript
import { RegisteredSchemaProfile } from './api';

const instance: RegisteredSchemaProfile = {
    did,
    schemaProfile,
    schemaProfileDidDocument,
    schemaProfileVerifiableCredential,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
