// @generated by protoc-gen-connect-es v1.6.1 with parameter "target=ts,js_import_style=module"
// @generated from file cacti/satp/v02/service/stage_0.proto (package cacti.satp.v02.service, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { CheckRequest, CheckResponse, NewSessionRequest, NewSessionResponse, PreSATPTransferRequest, PreSATPTransferResponse } from "./stage_0_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service cacti.satp.v02.service.SatpStage0Service
 */
export const SatpStage0Service = {
  typeName: "cacti.satp.v02.service.SatpStage0Service",
  methods: {
    /**
     * @generated from rpc cacti.satp.v02.service.SatpStage0Service.NewSession
     */
    newSession: {
      name: "NewSession",
      I: NewSessionRequest,
      O: NewSessionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cacti.satp.v02.service.SatpStage0Service.PreSATPTransfer
     */
    preSATPTransfer: {
      name: "PreSATPTransfer",
      I: PreSATPTransferRequest,
      O: PreSATPTransferResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cacti.satp.v02.service.SatpStage0Service.Check
     */
    check: {
      name: "Check",
      I: CheckRequest,
      O: CheckResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

