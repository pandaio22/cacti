# RegistryApi

All URIs are relative to *http://localhost:3000/api/@hyperledger/cacti-asset-schema-architecture/registry*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**commissionAssetSchema**](#commissionassetschema) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/registry/commission-asset-schema | Commission an Asset Schema|
|[**commissionSchemaProfile**](#commissionschemaprofile) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/registry/commission-schema-profile | Commission a Schema Profile|
|[**commissionTokenizedAssetRecord**](#commissiontokenizedassetrecord) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/registry/commission-tokenized-asset-record | Commission a Tokenized Asset Record (TAR)|
|[**getAssetProvider**](#getassetprovider) | **GET** /api/@hyperledger/cacti-asset-schema-architecture/registry/get-asset-provider/{uid} | Given an unique id, returns the X.509 certificate of an Asset Provider|
|[**getAssetSchema**](#getassetschema) | **GET** /api/@hyperledger/cacti-asset-schema-architecture/registry/get-asset-schema | Given an unique id, returns an Asset Schema|
|[**getAssetSchemaAuthority**](#getassetschemaauthority) | **GET** /api/@hyperledger/cacti-asset-schema-architecture/registry/get-asset-schema-authority/{uid} | Given an unique id, returns the X.509 certificate of an Asset Schema Authority (ASA)|
|[**getSchemaProfile**](#getschemaprofile) | **GET** /api/@hyperledger/cacti-asset-schema-architecture/registry/get-schema-profile/{uid} | Given an unique id, returns a Schema Profile|
|[**getTokenizedAssetRecord**](#gettokenizedassetrecord) | **GET** /api/@hyperledger/cacti-asset-schema-architecture/registry/get-tokenized-asset-record/{uid} | Given an unique id, returns a Tokenized Asset Record (TAR)|
|[**registerAssetProvider**](#registerassetprovider) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/registry/register-asset-provider | Register an Asset Provider|
|[**registerAssetSchemaAuthority**](#registerassetschemaauthority) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/registry/register-asset-schema-authority | Register an Asset Schema Authority|
|[**registerTokenIssuanceAuthorization**](#registertokenissuanceauthorization) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/registry/register-token-issuance-authorization | Register Token Issuance Authorization|

# **commissionAssetSchema**
> CommissionAssetSchema200Response commissionAssetSchema(commissionAssetSchemaRequest)

This endpoint allows a client to commission an Asset Schema into the Registry. 

### Example

```typescript
import {
    RegistryApi,
    Configuration,
    CommissionAssetSchemaRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let commissionAssetSchemaRequest: CommissionAssetSchemaRequest; //

const { status, data } = await apiInstance.commissionAssetSchema(
    commissionAssetSchemaRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commissionAssetSchemaRequest** | **CommissionAssetSchemaRequest**|  | |


### Return type

**CommissionAssetSchema200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Asset Schema commissioned successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commissionSchemaProfile**
> CommissionSchemaProfile200Response commissionSchemaProfile(commissionSchemaProfileRequest)

This endpoint allows a client to commission an Schema Profile into the Registry. 

### Example

```typescript
import {
    RegistryApi,
    Configuration,
    CommissionSchemaProfileRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let commissionSchemaProfileRequest: CommissionSchemaProfileRequest; //

const { status, data } = await apiInstance.commissionSchemaProfile(
    commissionSchemaProfileRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commissionSchemaProfileRequest** | **CommissionSchemaProfileRequest**|  | |


### Return type

**CommissionSchemaProfile200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Schema Profile commissioned successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **commissionTokenizedAssetRecord**
> CommissionTokenizedAssetRecord200Response commissionTokenizedAssetRecord(commissionTokenizedAssetRecordRequest)

This endpoint allows a client to commission a Tokenized Asset Record (TAR) into the Registry. 

### Example

```typescript
import {
    RegistryApi,
    Configuration,
    CommissionTokenizedAssetRecordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let commissionTokenizedAssetRecordRequest: CommissionTokenizedAssetRecordRequest; //

const { status, data } = await apiInstance.commissionTokenizedAssetRecord(
    commissionTokenizedAssetRecordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commissionTokenizedAssetRecordRequest** | **CommissionTokenizedAssetRecordRequest**|  | |


### Return type

**CommissionTokenizedAssetRecord200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Schema Profile commissioned successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAssetProvider**
> RegisterAssetProviderRequest getAssetProvider()

This endpoint allows a client to get the X.509 certificate of an Asset Provider, when given an unique id. 

### Example

```typescript
import {
    RegistryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let uid: string; //Unique identifier of the Asset Provider (default to undefined)

const { status, data } = await apiInstance.getAssetProvider(
    uid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] | Unique identifier of the Asset Provider | defaults to undefined|


### Return type

**RegisterAssetProviderRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Asset Provider returned successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAssetSchema**
> CommissionAssetSchemaRequest getAssetSchema()

This endpoint allows a client to get an Asset Schema, when given an unique id. 

### Example

```typescript
import {
    RegistryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let uid: string; //Unique identifier of the asset schema (default to undefined)

const { status, data } = await apiInstance.getAssetSchema(
    uid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] | Unique identifier of the asset schema | defaults to undefined|


### Return type

**CommissionAssetSchemaRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Asset Schema returned successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAssetSchemaAuthority**
> RegisterAssetSchemaAuthorityRequest getAssetSchemaAuthority()

This endpoint allows a client to get the X.509 certificate of an Asset Schema Authority (ASA), when given an unique id. 

### Example

```typescript
import {
    RegistryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let uid: string; //Unique identifier of the Asset Schema Authority (ASA) (default to undefined)

const { status, data } = await apiInstance.getAssetSchemaAuthority(
    uid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] | Unique identifier of the Asset Schema Authority (ASA) | defaults to undefined|


### Return type

**RegisterAssetSchemaAuthorityRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Asset Schema Authority (ASA) returned successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSchemaProfile**
> CommissionSchemaProfileRequest getSchemaProfile()

This endpoint allows a client to get a Schema Profile, when given an unique id. 

### Example

```typescript
import {
    RegistryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let uid: string; //Unique identifier of the Schema Profile (default to undefined)

const { status, data } = await apiInstance.getSchemaProfile(
    uid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] | Unique identifier of the Schema Profile | defaults to undefined|


### Return type

**CommissionSchemaProfileRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Schema Profile returned successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTokenizedAssetRecord**
> CommissionTokenizedAssetRecordRequest getTokenizedAssetRecord()

This endpoint allows a client to get a Tokenized Asset Record (TAR), when given an unique id. 

### Example

```typescript
import {
    RegistryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let uid: string; //Unique identifier of the Tokenized Asset Record (default to undefined)

const { status, data } = await apiInstance.getTokenizedAssetRecord(
    uid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] | Unique identifier of the Tokenized Asset Record | defaults to undefined|


### Return type

**CommissionTokenizedAssetRecordRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tokenized Asset Record returned successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerAssetProvider**
> RegisterAssetProvider200Response registerAssetProvider(registerAssetProviderRequest)

This endpoint allows a client to register an Asset Provider into the Registry. 

### Example

```typescript
import {
    RegistryApi,
    Configuration,
    RegisterAssetProviderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let registerAssetProviderRequest: RegisterAssetProviderRequest; //

const { status, data } = await apiInstance.registerAssetProvider(
    registerAssetProviderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerAssetProviderRequest** | **RegisterAssetProviderRequest**|  | |


### Return type

**RegisterAssetProvider200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Asset Provider registered successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerAssetSchemaAuthority**
> RegisterAssetSchemaAuthority200Response registerAssetSchemaAuthority(registerAssetSchemaAuthorityRequest)

This endpoint allows a client to register an Asset Schema Authority into the Registry. 

### Example

```typescript
import {
    RegistryApi,
    Configuration,
    RegisterAssetSchemaAuthorityRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let registerAssetSchemaAuthorityRequest: RegisterAssetSchemaAuthorityRequest; //

const { status, data } = await apiInstance.registerAssetSchemaAuthority(
    registerAssetSchemaAuthorityRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerAssetSchemaAuthorityRequest** | **RegisterAssetSchemaAuthorityRequest**|  | |


### Return type

**RegisterAssetSchemaAuthority200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Asset Schema Authority registered successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerTokenIssuanceAuthorization**
> RegisterTokenIssuanceAuthorization200Response registerTokenIssuanceAuthorization(registerTokenIssuanceAuthorizationRequest)

This endpoint allows a client to register Token Issuance Authorization (TIA), signed by a given Asset Schema Authority (ASA). 

### Example

```typescript
import {
    RegistryApi,
    Configuration,
    RegisterTokenIssuanceAuthorizationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RegistryApi(configuration);

let registerTokenIssuanceAuthorizationRequest: RegisterTokenIssuanceAuthorizationRequest; //

const { status, data } = await apiInstance.registerTokenIssuanceAuthorization(
    registerTokenIssuanceAuthorizationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerTokenIssuanceAuthorizationRequest** | **RegisterTokenIssuanceAuthorizationRequest**|  | |


### Return type

**RegisterTokenIssuanceAuthorization200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/ld+json
 - **Accept**: application/ld+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Token issuance authorization registered successfully |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

