#!/usr/bin/env node

/**
 * Zoho CRM SDK - Initialize and Test Script
 *
 * Usage: node templates/init-and-test.js
 *
 * This template demonstrates:
 * 1. SDK initialization
 * 2. Basic record operations (CRUD)
 * 3. Error handling
 */

import { InitializeBuilder } from "@zohocrm/typescript-sdk-2.0/routes/initialize_builder";
import { UserSignature } from "@zohocrm/typescript-sdk-2.0/routes/user_signature";
import { USDataCenter } from "@zohocrm/typescript-sdk-2.0/routes/dc/us_data_center";
import { EUDataCenter } from "@zohocrm/typescript-sdk-2.0/routes/dc/eu_data_center";
import { OAuthBuilder } from "@zohocrm/typescript-sdk-2.0/models/authenticator/oauth_builder";
import { DBBuilder } from "@zohocrm/typescript-sdk-2.0/models/authenticator/store/db_builder";
import { SDKConfigBuilder } from "@zohocrm/typescript-sdk-2.0/routes/sdk_config_builder";
import { LogBuilder, Levels } from "@zohocrm/typescript-sdk-2.0/routes/logger/log_builder";
import { RecordOperations } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/record_operations";
import { BodyWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/body_wrapper";
import { ResponseWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/response_wrapper";
import { ActionWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/action_wrapper";
import { Record } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/record";
import { SuccessResponse } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/success_response";
import { APIException } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/api_exception";
import { SDKException } from "@zohocrm/typescript-sdk-2.0/routes/sdk_exception";
import { GetRecordsParam } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/record_operations";
import { HeaderMap } from "@zohocrm/typescript-sdk-2.0/routes/header_map";

// Configuration
const CONFIG = {
    clientId: process.env.ZOHO_CLIENT_ID || "your_client_id",
    clientSecret: process.env.ZOHO_CLIENT_SECRET || "your_client_secret",
    refreshToken: process.env.ZOHO_REFRESH_TOKEN || "your_refresh_token",
    redirectURL: process.env.ZOHO_REDIRECT_URL || "https://yourredirect.com",
    userEmail: process.env.ZOHO_USER_EMAIL || "user@zoho.com",
    dbHost: process.env.ZOHO_DB_HOST || "localhost",
    dbName: process.env.ZOHO_DB_NAME || "zohooauth",
    dbUser: process.env.ZOHO_DB_USER || "root",
    dbPassword: process.env.ZOHO_DB_PASSWORD || "",
    dbPort: process.env.ZOHO_DB_PORT || "3306",
};

// Environment
const ENVIRONMENT = USDataCenter.PRODUCTION(); // or EUDataCenter.PRODUCTION()

async function initializeSDK() {
    console.log("Initializing Zoho CRM SDK...");

    try {
        await new InitializeBuilder()
            .user(new UserSignature(CONFIG.userEmail))
            .environment(ENVIRONMENT)
            .token(new OAuthBuilder()
                .clientId(CONFIG.clientId)
                .clientSecret(CONFIG.clientSecret)
                .refreshToken(CONFIG.refreshToken)
                .redirectURL(CONFIG.redirectURL)
                .build())
            .store(new DBBuilder()
                .host(CONFIG.dbHost)
                .databaseName(CONFIG.dbName)
                .userName(CONFIG.dbUser)
                .password(CONFIG.dbPassword)
                .portNumber(CONFIG.dbPort)
                .build())
            .SDKConfig(new SDKConfigBuilder()
                .pickListValidation(false)
                .autoRefreshFields(true)
                .build())
            .logger(new LogBuilder()
                .level(Levels.INFO)
                .filePath("./zoho-sdk.log")
                .build())
            .initialize();

        console.log("SDK initialized successfully!");
        return true;
    } catch (error) {
        if (error instanceof SDKException) {
            console.error("SDK initialization failed:", error.getMessage());
        } else {
            console.error("Unexpected error:", error);
        }
        return false;
    }
}

async function createRecord(moduleName: string, data: Record): Promise<string | null> {
    const recordOps = new RecordOperations(moduleName);
    const body = new BodyWrapper();
    body.setData([data]);

    try {
        const response = await recordOps.createRecords(moduleName, body);

        if (response.getObject() instanceof ActionWrapper) {
            const actions = response.getObject().getData();
            for (const action of actions) {
                if (action instanceof SuccessResponse) {
                    return action.getDetails().get("id");
                }
            }
        } else if (response.getObject() instanceof APIException) {
            const error = response.getObject();
            console.error("Create failed:", error.getMessage());
        }
    } catch (error) {
        if (error instanceof SDKException) {
            console.error("SDK error:", error.getMessage());
        }
    }
    return null;
}

async function getRecords(moduleName: string, page: number = 1, perPage: number = 200): Promise<Record[]> {
    const recordOps = new RecordOperations(moduleName);
    const params = new HeaderMap();
    params.add(GetRecordsParam.PAGE, page.toString());
    params.add(GetRecordsParam.PER_PAGE, perPage.toString());

    try {
        const response = await recordOps.getRecords(params, null);

        if (response.getObject() instanceof ResponseWrapper) {
            return response.getObject().getData();
        }
    } catch (error) {
        if (error instanceof SDKException) {
            console.error("SDK error:", error.getMessage());
        }
    }
    return [];
}

async function updateRecord(moduleName: string, recordId: string, data: Record): Promise<boolean> {
    const recordOps = new RecordOperations(moduleName);
    data.setId(BigInt(recordId));

    const body = new BodyWrapper();
    body.setData([data]);

    try {
        const response = await recordOps.updateRecord(recordId, body);

        if (response.getObject() instanceof ActionWrapper) {
            const actions = response.getObject().getData();
            for (const action of actions) {
                if (action instanceof SuccessResponse) {
                    return true;
                }
            }
        } else if (response.getObject() instanceof APIException) {
            const error = response.getObject();
            console.error("Update failed:", error.getMessage());
        }
    } catch (error) {
        if (error instanceof SDKException) {
            console.error("SDK error:", error.getMessage());
        }
    }
    return false;
}

async function deleteRecord(moduleName: string, recordId: string): Promise<boolean> {
    const recordOps = new RecordOperations(moduleName);

    try {
        const response = await recordOps.deleteRecord(recordId);

        if (response.getObject() instanceof ActionWrapper) {
            const actions = response.getObject().getData();
            for (const action of actions) {
                if (action instanceof SuccessResponse) {
                    return true;
                }
            }
        } else if (response.getObject() instanceof APIException) {
            const error = response.getObject();
            console.error("Delete failed:", error.getMessage());
        }
    } catch (error) {
        if (error instanceof SDKException) {
            console.error("SDK error:", error.getMessage());
        }
    }
    return false;
}

// Main execution
async function main() {
    console.log("Starting Zoho CRM SDK Test...\n");

    // Initialize
    const initialized = await initializeSDK();
    if (!initialized) {
        console.log("Failed to initialize SDK. Exiting.");
        process.exit(1);
    }

    // Test: Get all Leads
    console.log("\nFetching Leads...");
    const leads = await getRecords("Leads");
    console.log(`Found ${leads.length} leads`);

    if (leads.length > 0) {
        const firstLead = leads[0];
        console.log(`First lead ID: ${firstLead.getId()}`);
        console.log(`Last Name: ${firstLead.getKeyValue("Last_Name")}`);
    }

    // Test: Create a Lead
    console.log("\nCreating test lead...");
    const newLead = new Record();
    newLead.addKeyValue("Last_Name", "Test Contact");
    newLead.addKeyValue("Email", "test@example.com");
    newLead.addKeyValue("Company", "Test Company");

    const newId = await createRecord("Leads", newLead);
    if (newId) {
        console.log(`Created lead with ID: ${newId}`);

        // Test: Update the lead
        console.log("\nUpdating lead...");
        const updateData = new Record();
        updateData.addKeyValue("Last_Name", "Updated Name");
        const updated = await updateRecord("Leads", newId, updateData);
        console.log(`Update result: ${updated}`);

        // Test: Delete the lead
        console.log("\nDeleting lead...");
        const deleted = await deleteRecord("Leads", newId);
        console.log(`Delete result: ${deleted}`);
    }

    console.log("\nTest complete!");
}

main();