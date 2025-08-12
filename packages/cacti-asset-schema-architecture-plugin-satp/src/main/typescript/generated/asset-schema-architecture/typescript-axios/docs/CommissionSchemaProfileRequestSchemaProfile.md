# CommissionSchemaProfileRequestSchemaProfile

Structure of a valid Schema Profile (JSON-LD format)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**context** | [**CommissionSchemaProfileRequestSchemaProfileContext**](CommissionSchemaProfileRequestSchemaProfileContext.md) |  | [default to undefined]
**id** | **string** | Unique identifier for the Schema Profile. | [default to undefined]
**title** | **string** | Human-readable title of the Schema Profile. | [default to undefined]
**asset_schema** | **string** | Reference to the Asset Schema associated with this Schema Profile. | [default to undefined]
**fungible** | **boolean** | Indicates if the asset is fungible. | [default to undefined]
**organization_key** | [**CommissionSchemaProfileRequestSchemaProfileOrganizationKey**](CommissionSchemaProfileRequestSchemaProfileOrganizationKey.md) |  | [default to undefined]
**facets** | **object** | Additional facets or properties of the Schema Profile. | [default to undefined]

## Example

```typescript
import { CommissionSchemaProfileRequestSchemaProfile } from './api';

const instance: CommissionSchemaProfileRequestSchemaProfile = {
    context,
    id,
    title,
    asset_schema,
    fungible,
    organization_key,
    facets,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
