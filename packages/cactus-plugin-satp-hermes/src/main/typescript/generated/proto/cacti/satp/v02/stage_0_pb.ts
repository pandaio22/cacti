// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file cacti/satp/v02/stage_0.proto (package cacti.satp.v02, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Asset, WrapAssertionClaim } from "./common/message_pb.js";

/**
 * @generated from enum cacti.satp.v02.STATUS
 */
export enum STATUS {
  /**
   * @generated from enum value: STATUS_UNSPECIFIED = 0;
   */
  STATUS_UNSPECIFIED = 0,

  /**
   * @generated from enum value: STATUS_ACCEPTED = 1;
   */
  STATUS_ACCEPTED = 1,

  /**
   * @generated from enum value: STATUS_REJECTED = 2;
   */
  STATUS_REJECTED = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(STATUS)
proto3.util.setEnumType(STATUS, "cacti.satp.v02.STATUS", [
  { no: 0, name: "STATUS_UNSPECIFIED" },
  { no: 1, name: "STATUS_ACCEPTED" },
  { no: 2, name: "STATUS_REJECTED" },
]);

/**
 * @generated from message cacti.satp.v02.NewSessionRequest
 */
export class NewSessionRequest extends Message<NewSessionRequest> {
  /**
   * @generated from field: string session_id = 1;
   */
  sessionId = "";

  /**
   * @generated from field: string context_id = 2;
   */
  contextId = "";

  /**
   * @generated from field: string client_transfer_number = 3;
   */
  clientTransferNumber = "";

  /**
   * @generated from field: string sender_gateway_network_id = 4;
   */
  senderGatewayNetworkId = "";

  /**
   * @generated from field: string recipient_gateway_network_id = 5;
   */
  recipientGatewayNetworkId = "";

  /**
   * TODO FIX this change so it gets the gateway ID from channel
   *
   * @generated from field: string gateway_id = 6;
   */
  gatewayId = "";

  /**
   * @generated from field: string client_signature = 7;
   */
  clientSignature = "";

  constructor(data?: PartialMessage<NewSessionRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cacti.satp.v02.NewSessionRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "session_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "client_transfer_number", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "sender_gateway_network_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "recipient_gateway_network_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "gateway_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "client_signature", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NewSessionRequest {
    return new NewSessionRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NewSessionRequest {
    return new NewSessionRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NewSessionRequest {
    return new NewSessionRequest().fromJsonString(jsonString, options);
  }

  static equals(a: NewSessionRequest | PlainMessage<NewSessionRequest> | undefined, b: NewSessionRequest | PlainMessage<NewSessionRequest> | undefined): boolean {
    return proto3.util.equals(NewSessionRequest, a, b);
  }
}

/**
 * @generated from message cacti.satp.v02.NewSessionResponse
 */
export class NewSessionResponse extends Message<NewSessionResponse> {
  /**
   * @generated from field: string session_id = 1;
   */
  sessionId = "";

  /**
   * @generated from field: string context_id = 2;
   */
  contextId = "";

  /**
   * @generated from field: cacti.satp.v02.STATUS status = 3;
   */
  status = STATUS.STATUS_UNSPECIFIED;

  /**
   * @generated from field: string hash_previous_message = 4;
   */
  hashPreviousMessage = "";

  /**
   * @generated from field: string sender_gateway_network_id = 5;
   */
  senderGatewayNetworkId = "";

  /**
   * @generated from field: string recipient_gateway_network_id = 6;
   */
  recipientGatewayNetworkId = "";

  /**
   * @generated from field: string server_signature = 7;
   */
  serverSignature = "";

  constructor(data?: PartialMessage<NewSessionResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cacti.satp.v02.NewSessionResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "session_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "status", kind: "enum", T: proto3.getEnumType(STATUS) },
    { no: 4, name: "hash_previous_message", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "sender_gateway_network_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "recipient_gateway_network_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "server_signature", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NewSessionResponse {
    return new NewSessionResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NewSessionResponse {
    return new NewSessionResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NewSessionResponse {
    return new NewSessionResponse().fromJsonString(jsonString, options);
  }

  static equals(a: NewSessionResponse | PlainMessage<NewSessionResponse> | undefined, b: NewSessionResponse | PlainMessage<NewSessionResponse> | undefined): boolean {
    return proto3.util.equals(NewSessionResponse, a, b);
  }
}

/**
 * @generated from message cacti.satp.v02.PreSATPTransferRequest
 */
export class PreSATPTransferRequest extends Message<PreSATPTransferRequest> {
  /**
   * @generated from field: string session_id = 1;
   */
  sessionId = "";

  /**
   * @generated from field: string context_id = 2;
   */
  contextId = "";

  /**
   * @generated from field: string client_transfer_number = 3;
   */
  clientTransferNumber = "";

  /**
   * @generated from field: string sender_gateway_network_id = 4;
   */
  senderGatewayNetworkId = "";

  /**
   * @generated from field: string recipient_gateway_network_id = 5;
   */
  recipientGatewayNetworkId = "";

  /**
   * @generated from field: cacti.satp.v02.common.Asset sender_asset = 6;
   */
  senderAsset?: Asset;

  /**
   * @generated from field: cacti.satp.v02.common.Asset receiver_asset = 7;
   */
  receiverAsset?: Asset;

  /**
   * @generated from field: cacti.satp.v02.common.WrapAssertionClaim wrap_assertion_claim = 8;
   */
  wrapAssertionClaim?: WrapAssertionClaim;

  /**
   * @generated from field: string hash_previous_message = 9;
   */
  hashPreviousMessage = "";

  /**
   * @generated from field: string client_signature = 10;
   */
  clientSignature = "";

  constructor(data?: PartialMessage<PreSATPTransferRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cacti.satp.v02.PreSATPTransferRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "session_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "client_transfer_number", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "sender_gateway_network_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "recipient_gateway_network_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "sender_asset", kind: "message", T: Asset },
    { no: 7, name: "receiver_asset", kind: "message", T: Asset },
    { no: 8, name: "wrap_assertion_claim", kind: "message", T: WrapAssertionClaim },
    { no: 9, name: "hash_previous_message", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 10, name: "client_signature", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PreSATPTransferRequest {
    return new PreSATPTransferRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PreSATPTransferRequest {
    return new PreSATPTransferRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PreSATPTransferRequest {
    return new PreSATPTransferRequest().fromJsonString(jsonString, options);
  }

  static equals(a: PreSATPTransferRequest | PlainMessage<PreSATPTransferRequest> | undefined, b: PreSATPTransferRequest | PlainMessage<PreSATPTransferRequest> | undefined): boolean {
    return proto3.util.equals(PreSATPTransferRequest, a, b);
  }
}

/**
 * @generated from message cacti.satp.v02.PreSATPTransferResponse
 */
export class PreSATPTransferResponse extends Message<PreSATPTransferResponse> {
  /**
   * @generated from field: string session_id = 1;
   */
  sessionId = "";

  /**
   * @generated from field: string context_id = 2;
   */
  contextId = "";

  /**
   * @generated from field: cacti.satp.v02.common.WrapAssertionClaim wrap_assertion_claim = 3;
   */
  wrapAssertionClaim?: WrapAssertionClaim;

  /**
   * @generated from field: string hash_previous_message = 4;
   */
  hashPreviousMessage = "";

  /**
   * @generated from field: string recipient_token_id = 5;
   */
  recipientTokenId = "";

  /**
   * @generated from field: string server_signature = 6;
   */
  serverSignature = "";

  constructor(data?: PartialMessage<PreSATPTransferResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cacti.satp.v02.PreSATPTransferResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "session_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "context_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "wrap_assertion_claim", kind: "message", T: WrapAssertionClaim },
    { no: 4, name: "hash_previous_message", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "recipient_token_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "server_signature", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PreSATPTransferResponse {
    return new PreSATPTransferResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PreSATPTransferResponse {
    return new PreSATPTransferResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PreSATPTransferResponse {
    return new PreSATPTransferResponse().fromJsonString(jsonString, options);
  }

  static equals(a: PreSATPTransferResponse | PlainMessage<PreSATPTransferResponse> | undefined, b: PreSATPTransferResponse | PlainMessage<PreSATPTransferResponse> | undefined): boolean {
    return proto3.util.equals(PreSATPTransferResponse, a, b);
  }
}

/**
 * @generated from message cacti.satp.v02.CheckRequest
 */
export class CheckRequest extends Message<CheckRequest> {
  /**
   * @generated from field: string check = 1;
   */
  check = "";

  constructor(data?: PartialMessage<CheckRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cacti.satp.v02.CheckRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "check", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CheckRequest {
    return new CheckRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CheckRequest {
    return new CheckRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CheckRequest {
    return new CheckRequest().fromJsonString(jsonString, options);
  }

  static equals(a: CheckRequest | PlainMessage<CheckRequest> | undefined, b: CheckRequest | PlainMessage<CheckRequest> | undefined): boolean {
    return proto3.util.equals(CheckRequest, a, b);
  }
}

/**
 * @generated from message cacti.satp.v02.CheckResponse
 */
export class CheckResponse extends Message<CheckResponse> {
  /**
   * @generated from field: string check = 1;
   */
  check = "";

  constructor(data?: PartialMessage<CheckResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "cacti.satp.v02.CheckResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "check", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CheckResponse {
    return new CheckResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CheckResponse {
    return new CheckResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CheckResponse {
    return new CheckResponse().fromJsonString(jsonString, options);
  }

  static equals(a: CheckResponse | PlainMessage<CheckResponse> | undefined, b: CheckResponse | PlainMessage<CheckResponse> | undefined): boolean {
    return proto3.util.equals(CheckResponse, a, b);
  }
}

