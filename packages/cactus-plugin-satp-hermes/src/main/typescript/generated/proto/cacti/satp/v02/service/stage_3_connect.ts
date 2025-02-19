// @generated by protoc-gen-connect-es v1.6.1 with parameter "target=ts,js_import_style=module"
// @generated from file cacti/satp/v02/service/stage_3.proto (package cacti.satp.v02.service, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { CommitFinalAssertionRequest, CommitFinalAssertionResponse, CommitPreparationRequest, CommitPreparationResponse, TransferCompleteRequest, TransferCompleteResponse } from "./stage_3_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service cacti.satp.v02.service.SatpStage3Service
 */
export const SatpStage3Service = {
  typeName: "cacti.satp.v02.service.SatpStage3Service",
  methods: {
    /**
     * @generated from rpc cacti.satp.v02.service.SatpStage3Service.CommitPreparation
     */
    commitPreparation: {
      name: "CommitPreparation",
      I: CommitPreparationRequest,
      O: CommitPreparationResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cacti.satp.v02.service.SatpStage3Service.CommitFinalAssertion
     */
    commitFinalAssertion: {
      name: "CommitFinalAssertion",
      I: CommitFinalAssertionRequest,
      O: CommitFinalAssertionResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cacti.satp.v02.service.SatpStage3Service.TransferComplete
     */
    transferComplete: {
      name: "TransferComplete",
      I: TransferCompleteRequest,
      O: TransferCompleteResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

