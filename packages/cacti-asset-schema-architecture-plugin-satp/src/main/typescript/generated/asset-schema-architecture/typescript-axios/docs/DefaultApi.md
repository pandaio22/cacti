# DefaultApi

All URIs are relative to *http://localhost:3000/api/@hyperledger/cacti-asset-schema-architecture/registry*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**registerTokenIssuanceAuthorization**](#registertokenissuanceauthorization) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/registry/register-token-issuance-authorization | Register Token Issuance Authorization|
|[**requestTokenIssuanceAuthorization**](#requesttokenissuanceauthorization) | **POST** /api/@hyperledger/cacti-asset-schema-architecture/asset-schema-authority/token-issuance-authorization-request | Request Token Issuance Authorization|

# **registerTokenIssuanceAuthorization**
> RegisterTokenIssuanceAuthorization200Response registerTokenIssuanceAuthorization(requestTokenIssuanceAuthorization200Response)

This endpoint allows a client to register Token Issuance Authorization (TIA), signed by a given Asset Schema Authority (ASA). 

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RequestTokenIssuanceAuthorization200Response
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let requestTokenIssuanceAuthorization200Response: RequestTokenIssuanceAuthorization200Response; //

const { status, data } = await apiInstance.registerTokenIssuanceAuthorization(
    requestTokenIssuanceAuthorization200Response
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestTokenIssuanceAuthorization200Response** | **RequestTokenIssuanceAuthorization200Response**|  | |


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
|**200** | Token issuance authorization request successful |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestTokenIssuanceAuthorization**
> RequestTokenIssuanceAuthorization200Response requestTokenIssuanceAuthorization(requestTokenIssuanceAuthorizationRequest)

This endpoint allows a client to send a token issuance authorization request (TIAR). The request includes the TIAR schema and an Asset Provider signature. 

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RequestTokenIssuanceAuthorizationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let requestTokenIssuanceAuthorizationRequest: RequestTokenIssuanceAuthorizationRequest; //

const { status, data } = await apiInstance.requestTokenIssuanceAuthorization(
    requestTokenIssuanceAuthorizationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestTokenIssuanceAuthorizationRequest** | **RequestTokenIssuanceAuthorizationRequest**|  | |


### Return type

**RequestTokenIssuanceAuthorization200Response**

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

