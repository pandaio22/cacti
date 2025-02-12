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

// checks if the Transact200ResponseStatusResponseDestinationNetwork type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &Transact200ResponseStatusResponseDestinationNetwork{}

// Transact200ResponseStatusResponseDestinationNetwork struct for Transact200ResponseStatusResponseDestinationNetwork
type Transact200ResponseStatusResponseDestinationNetwork struct {
	DltProtocol interface{} `json:"dltProtocol,omitempty"`
	DltSubnetworkID interface{} `json:"dltSubnetworkID,omitempty"`
}

// NewTransact200ResponseStatusResponseDestinationNetwork instantiates a new Transact200ResponseStatusResponseDestinationNetwork object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewTransact200ResponseStatusResponseDestinationNetwork() *Transact200ResponseStatusResponseDestinationNetwork {
	this := Transact200ResponseStatusResponseDestinationNetwork{}
	return &this
}

// NewTransact200ResponseStatusResponseDestinationNetworkWithDefaults instantiates a new Transact200ResponseStatusResponseDestinationNetwork object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewTransact200ResponseStatusResponseDestinationNetworkWithDefaults() *Transact200ResponseStatusResponseDestinationNetwork {
	this := Transact200ResponseStatusResponseDestinationNetwork{}
	return &this
}

// GetDltProtocol returns the DltProtocol field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *Transact200ResponseStatusResponseDestinationNetwork) GetDltProtocol() interface{} {
	if o == nil {
		var ret interface{}
		return ret
	}
	return o.DltProtocol
}

// GetDltProtocolOk returns a tuple with the DltProtocol field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *Transact200ResponseStatusResponseDestinationNetwork) GetDltProtocolOk() (*interface{}, bool) {
	if o == nil || IsNil(o.DltProtocol) {
		return nil, false
	}
	return &o.DltProtocol, true
}

// HasDltProtocol returns a boolean if a field has been set.
func (o *Transact200ResponseStatusResponseDestinationNetwork) HasDltProtocol() bool {
	if o != nil && IsNil(o.DltProtocol) {
		return true
	}

	return false
}

// SetDltProtocol gets a reference to the given interface{} and assigns it to the DltProtocol field.
func (o *Transact200ResponseStatusResponseDestinationNetwork) SetDltProtocol(v interface{}) {
	o.DltProtocol = v
}

// GetDltSubnetworkID returns the DltSubnetworkID field value if set, zero value otherwise (both if not set or set to explicit null).
func (o *Transact200ResponseStatusResponseDestinationNetwork) GetDltSubnetworkID() interface{} {
	if o == nil {
		var ret interface{}
		return ret
	}
	return o.DltSubnetworkID
}

// GetDltSubnetworkIDOk returns a tuple with the DltSubnetworkID field value if set, nil otherwise
// and a boolean to check if the value has been set.
// NOTE: If the value is an explicit nil, `nil, true` will be returned
func (o *Transact200ResponseStatusResponseDestinationNetwork) GetDltSubnetworkIDOk() (*interface{}, bool) {
	if o == nil || IsNil(o.DltSubnetworkID) {
		return nil, false
	}
	return &o.DltSubnetworkID, true
}

// HasDltSubnetworkID returns a boolean if a field has been set.
func (o *Transact200ResponseStatusResponseDestinationNetwork) HasDltSubnetworkID() bool {
	if o != nil && IsNil(o.DltSubnetworkID) {
		return true
	}

	return false
}

// SetDltSubnetworkID gets a reference to the given interface{} and assigns it to the DltSubnetworkID field.
func (o *Transact200ResponseStatusResponseDestinationNetwork) SetDltSubnetworkID(v interface{}) {
	o.DltSubnetworkID = v
}

func (o Transact200ResponseStatusResponseDestinationNetwork) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o Transact200ResponseStatusResponseDestinationNetwork) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if o.DltProtocol != nil {
		toSerialize["dltProtocol"] = o.DltProtocol
	}
	if o.DltSubnetworkID != nil {
		toSerialize["dltSubnetworkID"] = o.DltSubnetworkID
	}
	return toSerialize, nil
}

type NullableTransact200ResponseStatusResponseDestinationNetwork struct {
	value *Transact200ResponseStatusResponseDestinationNetwork
	isSet bool
}

func (v NullableTransact200ResponseStatusResponseDestinationNetwork) Get() *Transact200ResponseStatusResponseDestinationNetwork {
	return v.value
}

func (v *NullableTransact200ResponseStatusResponseDestinationNetwork) Set(val *Transact200ResponseStatusResponseDestinationNetwork) {
	v.value = val
	v.isSet = true
}

func (v NullableTransact200ResponseStatusResponseDestinationNetwork) IsSet() bool {
	return v.isSet
}

func (v *NullableTransact200ResponseStatusResponseDestinationNetwork) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableTransact200ResponseStatusResponseDestinationNetwork(val *Transact200ResponseStatusResponseDestinationNetwork) *NullableTransact200ResponseStatusResponseDestinationNetwork {
	return &NullableTransact200ResponseStatusResponseDestinationNetwork{value: val, isSet: true}
}

func (v NullableTransact200ResponseStatusResponseDestinationNetwork) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableTransact200ResponseStatusResponseDestinationNetwork) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


