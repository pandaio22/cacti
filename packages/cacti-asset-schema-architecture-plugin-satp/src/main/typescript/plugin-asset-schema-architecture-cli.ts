#!/usr/bin/env node

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import {
  PluginAssetSchemaArchitecture,
  IPluginAssetSchemaArchitectureOptions,
} from "./plugin-asset-schema-architecture";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { v4 as uuidv4 } from "uuid";
import * as readline from "readline";

let pluginAssetSchemaArchitecture: PluginAssetSchemaArchitecture;

export async function launchAssetSchemaArchitecture(): Promise<void> {
  const logger = LoggerProvider.getOrCreate({
    level: "DEBUG",
    label: "Asset-Schema-Architecture",
  });

  logger.debug("Creating Config...");
  const logLevel: LogLevelDesc = "INFO";

  const pluginRegistry = new PluginRegistry({ logLevel, plugins: [] });

  const pluginAssetSchemaArchitectureOptions: IPluginAssetSchemaArchitectureOptions =
    {
      pluginRegistry,
      instanceId: uuidv4(),
      logLevel: "DEBUG",
    };

  logger.debug(
    "Asset Schema Architecture Plugin configuration options created successfully",
  );

  pluginAssetSchemaArchitecture = new PluginAssetSchemaArchitecture(
    pluginAssetSchemaArchitectureOptions,
  );

  try {
    logger.info("Starting Plugin...");
    await pluginAssetSchemaArchitecture.startup();
    logger.info("Plugin started successfully");
    logger.info("Type 'exit' to shutdown the plugin");
    
    //comment
    // Alternative: Direct stdin handling (uncomment if readline doesn't work)
    /*
    process.stdin.setRawMode(false);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let inputBuffer = "";
    
    process.stdin.on("data", async (data) => {
      inputBuffer += data.toString();
      
      // Check for complete lines
      const lines = inputBuffer.split('\n');
      inputBuffer = lines.pop() || ""; // Keep incomplete line in buffer
      
      for (const line of lines) {
        const input = line.trim();
        
        if (input === "exit") {
          logger.info("Received 'exit' command. Shutting down...");
          await shutdownGracefully(0);
          return;
        } else if (input) {
          logger.info(`Unknown command: ${input}`);
        }
      }
    });
    */

    // Create readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> "
    });

    // Show initial prompt
    rl.prompt();

    rl.on("line", async (input) => {
      const command = input.trim();

      if (command === "exit") {
        logger.info("Received 'exit' command. Shutting down...");
        rl.close();
        await shutdownGracefully(0);
      } else if (command === "") {
        // Just show prompt again for empty input
        rl.prompt();
      } else {
        logger.info(`Unknown command: ${command}`);
        rl.prompt();
      }
    });

    rl.on("close", async () => {
      logger.info("Input closed. Shutting down...");
      await shutdownGracefully(0);
    });

    // Handle process signals
    process.on("SIGINT", async () => {
      logger.info("Received SIGINT. Shutting down...");
      rl.close();
      await shutdownGracefully(0);
    });

    process.on("SIGTERM", async () => {
      logger.info("Received SIGTERM. Shutting down...");
      rl.close();
      await shutdownGracefully(0);
    });
  } catch (ex) {
    logger.error(`Plugin crashed. Exiting...`, ex);
    await shutdownGracefully(-1);
  }
}

async function shutdownGracefully(exitCode = 0): Promise<void> {
  if (pluginAssetSchemaArchitecture) {
    try {
      const logger = LoggerProvider.getOrCreate({
        level: "DEBUG",
        label: "Asset-Schema-Architecture",
      });
      logger.info("Shutting down plugin...");
      await pluginAssetSchemaArchitecture.shutdown();
      logger.info("Plugin shutdown completed.");
    } catch (err) {
      console.error("Error during shutdown:", err);
    }
  }
  process.exit(exitCode);
}

if (require.main === module) {
  launchAssetSchemaArchitecture();
}
