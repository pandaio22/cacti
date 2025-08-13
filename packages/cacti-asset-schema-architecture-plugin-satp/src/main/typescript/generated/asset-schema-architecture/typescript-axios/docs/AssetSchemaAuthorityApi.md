# AssetSchemaAuthorityApi

All URIs are relative to *http://localhost:3000/api/@hyperledger/cacti-asset-schema-architecture/registry*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assetSchemaCertification**](#assetschemacertification) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/asset-schema-authority/asset-schema-certification | Asset Schema Certification|
|[**requestTokenIssuanceAuthorization**](#requesttokenissuanceauthorization) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/asset-schema-authority/token-issuance-authorization-request | Request Token Issuance Authorization|
|[**schemaProfileCertification**](#schemaprofilecertification) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/asset-schema-authority/schema-profile-certification | Schema Profile Certification|

# **assetSchemaCertification**
> CommissionAssetSchemaRequest assetSchemaCertification(commissionAssetSchemaRequestAssetSchema)

This endpoint allows a client to send an asset schema to be certified by the Asset Schema Authority. If accepted, the Asset Schema Authority digitally signs the asset schema, and includes it in the response. 

### Example

```typescript
import {
    AssetSchemaAuthorityApi,
    Configuration,
    CommissionAssetSchemaRequestAssetSchema
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetSchemaAuthorityApi(configuration);

let commissionAssetSchemaRequestAssetSchema: CommissionAssetSchemaRequestAssetSchema; //

const { status, data } = await apiInstance.assetSchemaCertification(
    commissionAssetSchemaRequestAssetSchema
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commissionAssetSchemaRequestAssetSchema** | **CommissionAssetSchemaRequestAssetSchema**|  | |


### Return type

**CommissionAssetSchemaRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Asset Schema was certified successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestTokenIssuanceAuthorization**
> RegisterTokenIssuanceAuthorizationRequest requestTokenIssuanceAuthorization(registerTokenIssuanceAuthorizationRequestVerifiableCredentialInner)

This endpoint allows a client to send a token issuance authorization request (TIAR). The request includes the TIAR schema and an Asset Provider signature. 

### Example

```typescript
import {
    AssetSchemaAuthorityApi,
    Configuration,
    RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInner
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetSchemaAuthorityApi(configuration);

let registerTokenIssuanceAuthorizationRequestVerifiableCredentialInner: RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInner; //

const { status, data } = await apiInstance.requestTokenIssuanceAuthorization(
    registerTokenIssuanceAuthorizationRequestVerifiableCredentialInner
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerTokenIssuanceAuthorizationRequestVerifiableCredentialInner** | **RegisterTokenIssuanceAuthorizationRequestVerifiableCredentialInner**|  | |


### Return type

**RegisterTokenIssuanceAuthorizationRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Token issuance authorization request successful |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schemaProfileCertification**
> CommissionSchemaProfileRequest schemaProfileCertification(commissionSchemaProfileRequestSchemaProfile)

This endpoint allows a client to send a schema profile to be certified by the Asset Schema Authority. If accepted, the Asset Schema Authority digitally signs the schema profile, and includes it in the response. 

### Example

```typescript
import {
    AssetSchemaAuthorityApi,
    Configuration,
    CommissionSchemaProfileRequestSchemaProfile
} from './api';

const configuration = new Configuration();
const apiInstance = new AssetSchemaAuthorityApi(configuration);

let commissionSchemaProfileRequestSchemaProfile: CommissionSchemaProfileRequestSchemaProfile; //

const { status, data } = await apiInstance.schemaProfileCertification(
    commissionSchemaProfileRequestSchemaProfile
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commissionSchemaProfileRequestSchemaProfile** | **CommissionSchemaProfileRequestSchemaProfile**|  | |


### Return type

**CommissionSchemaProfileRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Schema Profile was certified successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

