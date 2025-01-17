import {
  TransferCommenceResponseMessage,
  TransferCommenceRequestMessage,
  TransferProposalRequestMessage,
  TransferProposalReceiptMessage,
  TransferProposalReceiptMessageSchema,
  TransferCommenceResponseMessageSchema,
} from "../../../generated/proto/cacti/satp/v02/stage_1_pb";
import {
  MessageType,
  NetworkCapabilities,
  SignatureAlgorithm,
  LockType,
  CommonSatpSchema,
} from "../../../generated/proto/cacti/satp/v02/common/message_pb";
// eslint-disable-next-line prettier/prettier
import { bufArray2HexStr, getHash, sign } from "../../../gateway-utils";
import { TransferClaims } from "../../../generated/proto/cacti/satp/v02/common/message_pb";
import {
  SessionType,
  TimestampType,
  getMessageHash,
  getMessageTimestamp,
  saveHash,
  saveSignature,
} from "../../session-utils";
import { stringify as safeStableStringify } from "safe-stable-stringify";

import { SupportedChain } from "../../types";
import { SATPSession } from "../../../core/satp-session";
import {
  SATPService,
  SATPServiceType,
  ISATPServerServiceOptions,
  ISATPServiceOptions,
} from "../satp-service";
import { commonBodyVerifier, signatureVerifier } from "../data-verifier";
import {
  DLTNotSupportedError,
  NetworkCapabilitiesError,
  SessionError,
  TransferInitClaimsError,
  TransferInitClaimsHashError,
} from "../../errors/satp-service-errors";
import { SATPInternalError } from "../../errors/satp-errors";
import { SessionNotFoundError } from "../../errors/satp-handler-errors";
import { State } from "../../../generated/proto/cacti/satp/v02/common/session_pb";
import { create } from "@bufbuild/protobuf";
export class Stage1ServerService extends SATPService {
  public static readonly SATP_STAGE = "1";
  public static readonly SERVICE_TYPE = SATPServiceType.Server;
  public static readonly SATP_SERVICE_INTERNAL_NAME = `stage-${this.SATP_STAGE}-${SATPServiceType[this.SERVICE_TYPE].toLowerCase()}`;

  constructor(ops: ISATPServerServiceOptions) {
    // for now stage1serverservice does not have any different options than the SATPService class

    const commonOptions: ISATPServiceOptions = {
      stage: Stage1ServerService.SATP_STAGE,
      loggerOptions: ops.loggerOptions,
      serviceName: ops.serviceName,
      signer: ops.signer,
      serviceType: Stage1ServerService.SERVICE_TYPE,
      dbLogger: ops.dbLogger,
    };
    super(commonOptions);
  }

  async transferProposalResponse(
    request: TransferProposalRequestMessage,
    session: SATPSession,
  ): Promise<void | TransferProposalReceiptMessage> {
    const stepTag = `transferProposalResponse()`;
    const fnTag = `${this.getServiceIdentifier()}#${stepTag}`;
    const messageType = MessageType[MessageType.INIT_RECEIPT];
    this.Log.debug(`${fnTag}, transferProposalResponse...`);

    if (session == undefined) {
      throw new SessionError(fnTag);
    }

    session.verify(
      fnTag,
      SessionType.SERVER,
      session.getServerSessionData().state == State.REJECTED,
    );

    const sessionData = session.getServerSessionData();

    await this.dbLogger.persistLogEntry({
      sessionID: sessionData.id,
      type: messageType,
      operation: "init",
      data: safeStableStringify(sessionData),
      sequenceNumber: Number(sessionData.lastSequenceNumber),
    });
    try {
      this.Log.info(`exec-${messageType}`);
      await this.dbLogger.persistLogEntry({
        sessionID: sessionData.id,
        type: messageType,
        operation: "exec",
        data: safeStableStringify(sessionData),
        sequenceNumber: Number(sessionData.lastSequenceNumber),
      });
      sessionData.sourceLedgerAssetId =
        request.transferInitClaims!.verifiedOriginatorEntityId;
      sessionData.recipientLedgerAssetId =
        request.transferInitClaims!.verifiedBeneficiaryEntityId; // todo shouldn't be the server to create this id?

      sessionData.hashTransferInitClaims = getHash(request.transferInitClaims);

      const commonBody = create(CommonSatpSchema, {
        version: sessionData.version,
        sessionId: sessionData.id,
        clientGatewayPubkey: sessionData.clientGatewayPubkey,
        serverGatewayPubkey: sessionData.serverGatewayPubkey,
        transferContextId: sessionData.transferContextId,
        resourceUrl: sessionData.resourceUrl,
        hashPreviousMessage: getMessageHash(
          sessionData,
          MessageType.INIT_PROPOSAL,
        ),
        sequenceNumber: request.common!.sequenceNumber + BigInt(1),
      });

      sessionData.lastSequenceNumber =
        request.common!.sequenceNumber + BigInt(1);

      const transferProposalReceiptMessage = create(
        TransferProposalReceiptMessageSchema,
        {},
      );
      if (sessionData.state == State.REJECTED) {
        transferProposalReceiptMessage.common = commonBody;
        commonBody.messageType = MessageType.INIT_REJECT;
        transferProposalReceiptMessage.timestamp = getMessageTimestamp(
          sessionData,
          MessageType.INIT_REJECT,
          TimestampType.RECEIVED,
        );
      } else if (sessionData.state == State.CONDITIONAL_REJECTED) {
        throw new Error("Not Implemented");
      } else {
        sessionData.state = State.ONGOING;
        transferProposalReceiptMessage.common = commonBody;
        transferProposalReceiptMessage.hashTransferInitClaims =
          sessionData.hashTransferInitClaims;
        commonBody.messageType = MessageType.INIT_RECEIPT;
        transferProposalReceiptMessage.timestamp = getMessageTimestamp(
          sessionData,
          MessageType.INIT_PROPOSAL,
          TimestampType.RECEIVED,
        );
      }

      //TODO implement conditional reject

      const messageSignature = bufArray2HexStr(
        sign(this.Signer, safeStableStringify(transferProposalReceiptMessage)),
      );

      transferProposalReceiptMessage.serverSignature = messageSignature;

      saveSignature(sessionData, commonBody.messageType, messageSignature);

      saveHash(
        sessionData,
        commonBody.messageType,
        getHash(transferProposalReceiptMessage),
      );

      await this.dbLogger.persistLogEntry({
        sessionID: sessionData.id,
        type: messageType,
        operation: "done",
        data: safeStableStringify(sessionData),
        sequenceNumber: Number(sessionData.lastSequenceNumber),
      });
      this.Log.info(`${fnTag}, sending TransferProposalResponseMessage...`);

      return transferProposalReceiptMessage;
    } catch (error) {
      this.Log.error(`fail-${messageType}`, error);
      await this.dbLogger.persistLogEntry({
        sessionID: sessionData.id,
        type: messageType,
        operation: "fail",
        data: safeStableStringify(sessionData),
        sequenceNumber: Number(sessionData.lastSequenceNumber),
      });
      throw error;
    }
  }

  async transferProposalErrorResponse(
    error: SATPInternalError,
    session?: SATPSession,
  ): Promise<TransferProposalReceiptMessage> {
    const errorResponse = create(TransferProposalReceiptMessageSchema, {});
    const commonBody = create(CommonSatpSchema, {
      messageType: MessageType.PRE_INIT_RECEIPT,
      error: true,
      errorCode: error.getSATPErrorType(),
    });

    if (!(error instanceof SessionNotFoundError) && session != undefined) {
      commonBody.sessionId = session.getServerSessionData().id;
    }
    errorResponse.common = commonBody;

    const messageSignature = bufArray2HexStr(
      sign(this.Signer, safeStableStringify(errorResponse)),
    );

    errorResponse.serverSignature = messageSignature;

    return errorResponse;
  }

  async transferCommenceErrorResponse(
    error: SATPInternalError,
    session?: SATPSession,
  ): Promise<TransferCommenceResponseMessage> {
    const errorResponse = create(TransferCommenceResponseMessageSchema, {});
    const commonBody = create(CommonSatpSchema, {
      messageType: MessageType.TRANSFER_COMMENCE_RESPONSE,
      error: true,
      errorCode: error.getSATPErrorType(),
    });

    if (!(error instanceof SessionNotFoundError) && session != undefined) {
      commonBody.sessionId = session.getServerSessionData().id;
    }
    errorResponse.common = commonBody;

    const messageSignature = bufArray2HexStr(
      sign(this.Signer, safeStableStringify(errorResponse)),
    );

    errorResponse.serverSignature = messageSignature;

    return errorResponse;
  }

  async transferCommenceResponse(
    request: TransferCommenceRequestMessage,
    session: SATPSession,
  ): Promise<void | TransferCommenceResponseMessage> {
    const stepTag = `transferCommenceResponse()`;
    const fnTag = `${this.getServiceIdentifier()}#${stepTag}`;
    const messageType = MessageType[MessageType.TRANSFER_COMMENCE_RESPONSE];
    this.Log.debug(`${fnTag}, transferCommenceResponse...`);

    if (session == undefined) {
      throw new SessionError(fnTag);
    }

    session.verify(fnTag, SessionType.SERVER);

    const sessionData = session.getServerSessionData();
    await this.dbLogger.persistLogEntry({
      sessionID: sessionData.id,
      type: messageType,
      operation: "init",
      data: safeStableStringify(sessionData),
      sequenceNumber: Number(sessionData.lastSequenceNumber),
    });
    try {
      this.Log.info(`exec-${messageType}`);
      await this.dbLogger.persistLogEntry({
        sessionID: sessionData.id,
        type: messageType,
        operation: "exec",
        data: safeStableStringify(sessionData),
        sequenceNumber: Number(sessionData.lastSequenceNumber),
      });

      const commonBody = create(CommonSatpSchema, {
        version: sessionData.version,
        sessionId: sessionData.id,
        clientGatewayPubkey: sessionData.clientGatewayPubkey,
        serverGatewayPubkey: sessionData.serverGatewayPubkey,
        transferContextId: sessionData.transferContextId,
        resourceUrl: sessionData.resourceUrl,
        hashPreviousMessage: getMessageHash(
          sessionData,
          MessageType.TRANSFER_COMMENCE_REQUEST,
        ),
        sequenceNumber: request.common!.sequenceNumber + BigInt(1),
        messageType: MessageType.TRANSFER_COMMENCE_RESPONSE,
      });
      sessionData.lastSequenceNumber = commonBody.sequenceNumber =
        request.common!.sequenceNumber + BigInt(1);

      const transferCommenceResponseMessage = create(
        TransferCommenceResponseMessageSchema,
        {
          common: commonBody,
        },
      );

      const messageSignature = bufArray2HexStr(
        sign(this.Signer, safeStableStringify(transferCommenceResponseMessage)),
      );

      transferCommenceResponseMessage.serverSignature = messageSignature;

      saveSignature(
        sessionData,
        MessageType.TRANSFER_COMMENCE_RESPONSE,
        messageSignature,
      );

      saveHash(
        sessionData,
        MessageType.TRANSFER_COMMENCE_RESPONSE,
        getHash(transferCommenceResponseMessage),
      );

      await this.dbLogger.persistLogEntry({
        sessionID: sessionData.id,
        type: messageType,
        operation: "done",
        data: safeStableStringify(sessionData),
        sequenceNumber: Number(sessionData.lastSequenceNumber),
      });

      this.Log.info(`${fnTag}, sending TransferCommenceResponseMessage...`);

      return transferCommenceResponseMessage;
    } catch (error) {
      this.Log.error(`fail-${messageType}`, error);
      await this.dbLogger.persistLogEntry({
        sessionID: sessionData.id,
        type: messageType,
        operation: "fail",
        data: safeStableStringify(sessionData),
        sequenceNumber: Number(sessionData.lastSequenceNumber),
      });
      throw error;
    }
  }

  async checkTransferProposalRequestMessage(
    request: TransferProposalRequestMessage,
    session: SATPSession,
    supportedDLTs: SupportedChain[],
  ): Promise<void> {
    const stepTag = `checkTransferProposalRequestMessage()`;
    const fnTag = `${this.getServiceIdentifier()}#${stepTag}`;
    this.Log.debug(`${fnTag}, checkTransferProposalRequestMessage...`);

    if (session == undefined) {
      throw new SessionError(fnTag);
    }

    const sessionData = session.getServerSessionData();

    this.checkNetworkCapabilities(request.networkCapabilities, fnTag);

    if (this.checkTransferClaims(request.transferInitClaims, fnTag)) {
      this.Log.info(`${fnTag}, TransferProposalRequest was accepted...`);
    } else if (false) {
      sessionData.state = State.CONDITIONAL_REJECTED;
      //TODO Implement
    } else {
      this.Log.info(`${fnTag}, TransferProposalRequest was rejected...`);
      sessionData.state = State.REJECTED;
      return;
    }

    const receiverId = request.transferInitClaims!
      .recipientGatewayNetworkId as SupportedChain;

    if (!supportedDLTs.includes(receiverId)) {
      throw new DLTNotSupportedError(fnTag, receiverId); //todo change this to the transferClaims check
    }

    sessionData.version = request.common!.version;
    sessionData.digitalAssetId = request.transferInitClaims!.digitalAssetId;
    sessionData.originatorPubkey = request.transferInitClaims!.originatorPubkey;
    sessionData.beneficiaryPubkey =
      request.transferInitClaims!.beneficiaryPubkey;
    sessionData.senderGatewayNetworkId =
      request.transferInitClaims!.senderGatewayNetworkId;
    sessionData.recipientGatewayNetworkId =
      request.transferInitClaims!.recipientGatewayNetworkId;
    sessionData.clientGatewayPubkey =
      request.transferInitClaims!.clientGatewayPubkey;
    sessionData.serverGatewayPubkey =
      request.transferInitClaims!.serverGatewayPubkey;
    sessionData.receiverGatewayOwnerId =
      request.transferInitClaims!.receiverGatewayOwnerId;
    sessionData.senderGatewayOwnerId =
      request.transferInitClaims!.senderGatewayOwnerId;
    sessionData.signatureAlgorithm =
      request.networkCapabilities!.signatureAlgorithm;
    sessionData.lockType = request.networkCapabilities!.lockType;
    sessionData.lockExpirationTime =
      request.networkCapabilities!.lockExpirationTime;
    sessionData.credentialProfile =
      request.networkCapabilities!.credentialProfile;
    sessionData.loggingProfile = request.networkCapabilities!.loggingProfile;
    sessionData.accessControlProfile =
      request.networkCapabilities!.accessControlProfile;
    sessionData.resourceUrl = request.common!.resourceUrl;

    session.verify(fnTag, SessionType.SERVER);

    commonBodyVerifier(
      fnTag,
      request.common,
      sessionData,
      MessageType.INIT_PROPOSAL,
    );

    signatureVerifier(fnTag, this.Signer, request, sessionData);

    this.Log.info(
      `${fnTag}, Session data created for session id ${sessionData.id}`,
    );

    saveHash(sessionData, MessageType.INIT_PROPOSAL, getHash(request));

    this.Log.info(`${fnTag}, TransferProposalRequest passed all checks.`);
  }

  async checkTransferCommenceRequestMessage(
    request: TransferCommenceRequestMessage,
    session: SATPSession,
  ): Promise<void> {
    const stepTag = `checkTransferCommenceRequestMessage()`;
    const fnTag = `${this.getServiceIdentifier()}#${stepTag}`;

    if (session == undefined) {
      throw new SessionError(fnTag);
    }

    session.verify(fnTag, SessionType.SERVER);

    const sessionData = session.getServerSessionData();

    commonBodyVerifier(
      fnTag,
      request.common,
      sessionData,
      MessageType.TRANSFER_COMMENCE_REQUEST,
    );

    signatureVerifier(fnTag, this.Signer, request, sessionData);

    if (
      request.hashTransferInitClaims == "" ||
      request.hashTransferInitClaims != sessionData.hashTransferInitClaims
    ) {
      throw new TransferInitClaimsHashError(fnTag);
    }

    if (request.clientTransferNumber != "") {
      this.Log.info(
        `${fnTag}, Optional variable loaded: clientTransferNumber...`,
      );
      sessionData.clientTransferNumber = request.clientTransferNumber;
    }

    saveHash(
      sessionData,
      MessageType.TRANSFER_COMMENCE_REQUEST,
      getHash(request),
    );

    //if the conditional parameters where accepted, the session state is still ongoing
    //TODO timeout for accepting the parameters
    sessionData.state = State.ONGOING;

    this.Log.info(`${fnTag}, TransferCommenceRequest passed all checks.`);
  }

  private checkTransferClaims(
    transferClaims: TransferClaims | undefined,
    tag: string,
  ): boolean {
    if (transferClaims == undefined) {
      throw new TransferInitClaimsError(tag);
    }
    if (transferClaims.digitalAssetId == "") {
      this.Log.error(`${tag}, digitalAssetId is missing`);
    }
    if (transferClaims.assetProfileId == "") {
      this.Log.error(`${tag}, assetProfileId is missing`);
      //return false;
    }
    if (transferClaims.verifiedOriginatorEntityId == "") {
      this.Log.error(`${tag}, verifiedOriginatorEntityId is missing`);
      //return false;
    }
    if (transferClaims.verifiedBeneficiaryEntityId == "") {
      this.Log.error(`${tag}, verifiedBeneficiaryEntityId is missing`);
    }
    if (transferClaims.originatorPubkey == "") {
      this.Log.error(`${tag}, originatorPubkey is missing`);
      //return false;
    }
    if (transferClaims.beneficiaryPubkey == "") {
      this.Log.error(`${tag}, beneficiaryPubkey is missing`);
      return false;
    }
    if (transferClaims.senderGatewayNetworkId != "") {
      this.Log.info(`${tag}, optional variable senderGatewayNetworkId loaded`);
    }
    if (transferClaims.recipientGatewayNetworkId != "") {
      this.Log.info(
        `${tag}, optional variable recipientGatewayNetworkId loaded`,
      );
    }
    if (transferClaims.clientGatewayPubkey == "") {
      this.Log.error(`${tag}, clientGatewayPubkey is missing`);
      return false;
    }
    if (transferClaims.serverGatewayPubkey == "") {
      this.Log.error(`${tag}, serverGatewayPubkey is missing`);
      return false;
    }
    if (transferClaims.senderGatewayOwnerId != "") {
      this.Log.info(`${tag}, optional variable senderGatewayNetworkId loaded`);
    }
    if (transferClaims.receiverGatewayOwnerId != "") {
      this.Log.info(`${tag}, optional variable receiverGatewayOwnerId loaded`);
    }
    //todo
    return true;
  }

  private checkNetworkCapabilities(
    networkCapabilities: NetworkCapabilities | undefined,
    tag: string,
  ): boolean {
    if (networkCapabilities == undefined) {
      throw new NetworkCapabilitiesError(tag);
    }
    if (networkCapabilities.senderGatewayNetworkId == "") {
    }
    if (
      networkCapabilities.signatureAlgorithm == SignatureAlgorithm.UNSPECIFIED
    ) {
    }
    if (networkCapabilities.supportedSignatureAlgorithms.length == 0) {
    }
    if (networkCapabilities.lockType == LockType.UNSPECIFIED) {
    }
    if (networkCapabilities.lockExpirationTime == BigInt(0)) {
    }
    if (networkCapabilities.permissions == undefined) {
    }
    if (networkCapabilities.developerUrn == "") {
    }
    if (networkCapabilities.credentialProfile == undefined) {
    }
    if (networkCapabilities.applicationProfile == "") {
    }
    if (networkCapabilities.loggingProfile == "") {
    }
    if (networkCapabilities.accessControlProfile == "") {
    }
    if (networkCapabilities.subsequentCalls == undefined) {
    }
    if (networkCapabilities.history == undefined) {
    }
    //todo
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private counterProposalTransferClaims(
    oldClaims: TransferClaims,
  ): TransferClaims {
    //todo
    return oldClaims;
  }
}
