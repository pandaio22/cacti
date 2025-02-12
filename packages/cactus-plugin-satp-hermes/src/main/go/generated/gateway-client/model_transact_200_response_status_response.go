/*
SATP Gateway Client (Business Logic Orchestrator)

SATP is a protocol operating between two gateways that conducts the transfer of a digital asset from one gateway to another. The protocol establishes a secure channel between the endpoints and implements a 2-phase commit to ensure the properties of transfer atomicity, consistency, isolation and durability.  This API defines the gateway client facing API (business logic orchestrator, or BLO), which is named API-Type 1 in the SATP-Core specification.  **Additional Resources**: - [Proposed SATP Charter](https://datatracker.ietf.org/doc/charter-ietf-satp/) - [SATP Core draft](https://datatracker.ietf.org/doc/draft-ietf-satp-core) - [SATP Crash Recovery draft](https://datatracker.ietf.org/doc/draft-belchior-satp-gateway-recovery/) - [SATP Architecture draft](https://datatracker.ietf.org/doc/draft-ietf-satp-architecture/) - [SATP Use-Cases draft](https://datatracker.ietf.org/doc/draft-ramakrishna-sat-use-cases/) - [SATP Data sharing draft](https://datatracker.ietf.org/doc/draft-ramakrishna-satp-data-sharing) - [SATP View Addresses draft](https://datatracker.ietf.org/doc/draft-ramakrishna-satp-views-addresses)

API version: 0.0.2
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package generated

import (
	"encoding/json"
	"time"
)

// checks if the Transact200ResponseStatusResponse type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &Transact200ResponseStatusResponse{}

// Transact200ResponseStatusResponse Provides the current status of the SATP session including detailed information on the progress, such as substatus, stage, and step, along with the session start time and chain information.
type Transact200ResponseStatusResponse struct {
	Status string `json:"status"`
	Substatus string `json:"substatus"`
	Stage string `json:"stage"`
	Step string `json:"step"`
	StartTime time.Time `json:"startTime"`
	OriginNetwork Transact200ResponseStatusResponseOriginNetwork `json:"originNetwork"`
	DestinationNetwork Transact200ResponseStatusResponseDestinationNetwork `json:"destinationNetwork"`
}

// NewTransact200ResponseStatusResponse instantiates a new Transact200ResponseStatusResponse object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewTransact200ResponseStatusResponse(status string, substatus string, stage string, step string, startTime time.Time, originNetwork Transact200ResponseStatusResponseOriginNetwork, destinationNetwork Transact200ResponseStatusResponseDestinationNetwork) *Transact200ResponseStatusResponse {
	this := Transact200ResponseStatusResponse{}
	this.Status = status
	this.Substatus = substatus
	this.Stage = stage
	this.Step = step
	this.StartTime = startTime
	this.OriginNetwork = originNetwork
	this.DestinationNetwork = destinationNetwork
	return &this
}

// NewTransact200ResponseStatusResponseWithDefaults instantiates a new Transact200ResponseStatusResponse object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewTransact200ResponseStatusResponseWithDefaults() *Transact200ResponseStatusResponse {
	this := Transact200ResponseStatusResponse{}
	return &this
}

// GetStatus returns the Status field value
func (o *Transact200ResponseStatusResponse) GetStatus() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Status
}

// GetStatusOk returns a tuple with the Status field value
// and a boolean to check if the value has been set.
func (o *Transact200ResponseStatusResponse) GetStatusOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Status, true
}

// SetStatus sets field value
func (o *Transact200ResponseStatusResponse) SetStatus(v string) {
	o.Status = v
}

// GetSubstatus returns the Substatus field value
func (o *Transact200ResponseStatusResponse) GetSubstatus() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Substatus
}

// GetSubstatusOk returns a tuple with the Substatus field value
// and a boolean to check if the value has been set.
func (o *Transact200ResponseStatusResponse) GetSubstatusOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Substatus, true
}

// SetSubstatus sets field value
func (o *Transact200ResponseStatusResponse) SetSubstatus(v string) {
	o.Substatus = v
}

// GetStage returns the Stage field value
func (o *Transact200ResponseStatusResponse) GetStage() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Stage
}

// GetStageOk returns a tuple with the Stage field value
// and a boolean to check if the value has been set.
func (o *Transact200ResponseStatusResponse) GetStageOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Stage, true
}

// SetStage sets field value
func (o *Transact200ResponseStatusResponse) SetStage(v string) {
	o.Stage = v
}

// GetStep returns the Step field value
func (o *Transact200ResponseStatusResponse) GetStep() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Step
}

// GetStepOk returns a tuple with the Step field value
// and a boolean to check if the value has been set.
func (o *Transact200ResponseStatusResponse) GetStepOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Step, true
}

// SetStep sets field value
func (o *Transact200ResponseStatusResponse) SetStep(v string) {
	o.Step = v
}

// GetStartTime returns the StartTime field value
func (o *Transact200ResponseStatusResponse) GetStartTime() time.Time {
	if o == nil {
		var ret time.Time
		return ret
	}

	return o.StartTime
}

// GetStartTimeOk returns a tuple with the StartTime field value
// and a boolean to check if the value has been set.
func (o *Transact200ResponseStatusResponse) GetStartTimeOk() (*time.Time, bool) {
	if o == nil {
		return nil, false
	}
	return &o.StartTime, true
}

// SetStartTime sets field value
func (o *Transact200ResponseStatusResponse) SetStartTime(v time.Time) {
	o.StartTime = v
}

// GetOriginNetwork returns the OriginNetwork field value
func (o *Transact200ResponseStatusResponse) GetOriginNetwork() Transact200ResponseStatusResponseOriginNetwork {
	if o == nil {
		var ret Transact200ResponseStatusResponseOriginNetwork
		return ret
	}

	return o.OriginNetwork
}

// GetOriginNetworkOk returns a tuple with the OriginNetwork field value
// and a boolean to check if the value has been set.
func (o *Transact200ResponseStatusResponse) GetOriginNetworkOk() (*Transact200ResponseStatusResponseOriginNetwork, bool) {
	if o == nil {
		return nil, false
	}
	return &o.OriginNetwork, true
}

// SetOriginNetwork sets field value
func (o *Transact200ResponseStatusResponse) SetOriginNetwork(v Transact200ResponseStatusResponseOriginNetwork) {
	o.OriginNetwork = v
}

// GetDestinationNetwork returns the DestinationNetwork field value
func (o *Transact200ResponseStatusResponse) GetDestinationNetwork() Transact200ResponseStatusResponseDestinationNetwork {
	if o == nil {
		var ret Transact200ResponseStatusResponseDestinationNetwork
		return ret
	}

	return o.DestinationNetwork
}

// GetDestinationNetworkOk returns a tuple with the DestinationNetwork field value
// and a boolean to check if the value has been set.
func (o *Transact200ResponseStatusResponse) GetDestinationNetworkOk() (*Transact200ResponseStatusResponseDestinationNetwork, bool) {
	if o == nil {
		return nil, false
	}
	return &o.DestinationNetwork, true
}

// SetDestinationNetwork sets field value
func (o *Transact200ResponseStatusResponse) SetDestinationNetwork(v Transact200ResponseStatusResponseDestinationNetwork) {
	o.DestinationNetwork = v
}

func (o Transact200ResponseStatusResponse) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o Transact200ResponseStatusResponse) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["status"] = o.Status
	toSerialize["substatus"] = o.Substatus
	toSerialize["stage"] = o.Stage
	toSerialize["step"] = o.Step
	toSerialize["startTime"] = o.StartTime
	toSerialize["originNetwork"] = o.OriginNetwork
	toSerialize["destinationNetwork"] = o.DestinationNetwork
	return toSerialize, nil
}

type NullableTransact200ResponseStatusResponse struct {
	value *Transact200ResponseStatusResponse
	isSet bool
}

func (v NullableTransact200ResponseStatusResponse) Get() *Transact200ResponseStatusResponse {
	return v.value
}

func (v *NullableTransact200ResponseStatusResponse) Set(val *Transact200ResponseStatusResponse) {
	v.value = val
	v.isSet = true
}

func (v NullableTransact200ResponseStatusResponse) IsSet() bool {
	return v.isSet
}

func (v *NullableTransact200ResponseStatusResponse) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableTransact200ResponseStatusResponse(val *Transact200ResponseStatusResponse) *NullableTransact200ResponseStatusResponse {
	return &NullableTransact200ResponseStatusResponse{value: val, isSet: true}
}

func (v NullableTransact200ResponseStatusResponse) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableTransact200ResponseStatusResponse) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


