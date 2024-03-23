/*
SATP Gateway Client (Business Logic Orchestrator)

SATP is a protocol operating between two gateways that conducts the transfer of a digital asset from one gateway to another. The protocol establishes a secure channel between the endpoints and implements a 2-phase commit to ensure the properties of transfer atomicity, consistency, isolation and durability.  This API defines the gateway client facing API (business logic orchestrator, or BLO), which is named API-Type 1 in the SATP-Core specification.  **Additional Resources**: - [Proposed SATP Charter](https://datatracker.ietf.org/doc/charter-ietf-satp/) - [SATP Core draft](https://datatracker.ietf.org/doc/draft-ietf-satp-core) - [SATP Crash Recovery draft](https://datatracker.ietf.org/doc/draft-belchior-satp-gateway-recovery/) - [SATP Architecture draft](https://datatracker.ietf.org/doc/draft-ietf-satp-architecture/) - [SATP Use-Cases draft](https://datatracker.ietf.org/doc/draft-ramakrishna-sat-use-cases/) - [SATP Data sharing draft](https://datatracker.ietf.org/doc/draft-ramakrishna-satp-data-sharing) - [SATP View Addresses draft](https://datatracker.ietf.org/doc/draft-ramakrishna-satp-views-addresses)

API version: 0.0.2
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package generated

import (
	"encoding/json"
)

// checks if the Cancel200Response type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &Cancel200Response{}

// Cancel200Response Response for a cancel transaction request. Indicates whether the cancel action was successful and includes the current session status.
type Cancel200Response struct {
	StatusResponse Transact200ResponseStatusResponse `json:"statusResponse"`
	// Indicates whether the cancel operation was successful.
	CancelSuccessful bool `json:"cancelSuccessful"`
}

// NewCancel200Response instantiates a new Cancel200Response object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewCancel200Response(statusResponse Transact200ResponseStatusResponse, cancelSuccessful bool) *Cancel200Response {
	this := Cancel200Response{}
	this.StatusResponse = statusResponse
	this.CancelSuccessful = cancelSuccessful
	return &this
}

// NewCancel200ResponseWithDefaults instantiates a new Cancel200Response object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewCancel200ResponseWithDefaults() *Cancel200Response {
	this := Cancel200Response{}
	return &this
}

// GetStatusResponse returns the StatusResponse field value
func (o *Cancel200Response) GetStatusResponse() Transact200ResponseStatusResponse {
	if o == nil {
		var ret Transact200ResponseStatusResponse
		return ret
	}

	return o.StatusResponse
}

// GetStatusResponseOk returns a tuple with the StatusResponse field value
// and a boolean to check if the value has been set.
func (o *Cancel200Response) GetStatusResponseOk() (*Transact200ResponseStatusResponse, bool) {
	if o == nil {
		return nil, false
	}
	return &o.StatusResponse, true
}

// SetStatusResponse sets field value
func (o *Cancel200Response) SetStatusResponse(v Transact200ResponseStatusResponse) {
	o.StatusResponse = v
}

// GetCancelSuccessful returns the CancelSuccessful field value
func (o *Cancel200Response) GetCancelSuccessful() bool {
	if o == nil {
		var ret bool
		return ret
	}

	return o.CancelSuccessful
}

// GetCancelSuccessfulOk returns a tuple with the CancelSuccessful field value
// and a boolean to check if the value has been set.
func (o *Cancel200Response) GetCancelSuccessfulOk() (*bool, bool) {
	if o == nil {
		return nil, false
	}
	return &o.CancelSuccessful, true
}

// SetCancelSuccessful sets field value
func (o *Cancel200Response) SetCancelSuccessful(v bool) {
	o.CancelSuccessful = v
}

func (o Cancel200Response) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o Cancel200Response) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["statusResponse"] = o.StatusResponse
	toSerialize["cancelSuccessful"] = o.CancelSuccessful
	return toSerialize, nil
}

type NullableCancel200Response struct {
	value *Cancel200Response
	isSet bool
}

func (v NullableCancel200Response) Get() *Cancel200Response {
	return v.value
}

func (v *NullableCancel200Response) Set(val *Cancel200Response) {
	v.value = val
	v.isSet = true
}

func (v NullableCancel200Response) IsSet() bool {
	return v.isSet
}

func (v *NullableCancel200Response) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableCancel200Response(val *Cancel200Response) *NullableCancel200Response {
	return &NullableCancel200Response{value: val, isSet: true}
}

func (v NullableCancel200Response) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableCancel200Response) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


