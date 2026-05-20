# Sample Codes - Zoho CRM TypeScript SDK v2

## Overview

Complete working examples for common SDK operations.

---

## Complete Initialization

```typescript
import { InitializeBuilder } from "@zohocrm/typescript-sdk-2.0/routes/initialize_builder";
import { UserSignature } from "@zohocrm/typescript-sdk-2.0/routes/user_signature";
import { USDataCenter } from "@zohocrm/typescript-sdk-2.0/routes/dc/us_data_center";
import { OAuthBuilder } from "@zohocrm/typescript-sdk-2.0/models/authenticator/oauth_builder";
import { DBBuilder } from "@zohocrm/typescript-sdk-2.0/models/authenticator/store/db_builder";
import { SDKConfigBuilder } from "@zohocrm/typescript-sdk-2.0/routes/sdk_config_builder";
import { LogBuilder, Levels } from "@zohocrm/typescript-sdk-2.0/routes/logger/log_builder";

async function initializeSDK() {
    try {
        await new InitializeBuilder()
            .user(new UserSignature("user@zoho.com"))
            .environment(USDataCenter.PRODUCTION())
            .token(new OAuthBuilder()
                .clientId("clientId")
                .clientSecret("clientSecret")
                .refreshToken("refreshToken")
                .redirectURL("redirectURL")
                .build())
            .store(new DBBuilder()
                .host("localhost")
                .databaseName("zohooauth")
                .userName("root")
                .password("")
                .portNumber("3306")
                .build())
            .SDKConfig(new SDKConfigBuilder()
                .pickListValidation(false)
                .autoRefreshFields(true)
                .build())
            .resourcePath("/path/to/resources")
            .logger(new LogBuilder()
                .level(Levels.INFO)
                .filePath("/path/to/log.txt")
                .build())
            .initialize();

        console.log("SDK Initialized Successfully");
    } catch (error) {
        console.error("Initialization Failed:", error);
    }
}

initializeSDK();
```

---

## Record Operations Complete Example

```typescript
import { RecordOperations } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/record_operations";
import { BodyWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/body_wrapper";
import { ResponseWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/response_wrapper";
import { ActionWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/action_wrapper";
import { Record } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/record";
import { SuccessResponse } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/success_response";
import { APIException } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/api_exception";
import { HeaderMap } from "@zohocrm/typescript-sdk-2.0/routes/header_map";
import { GetRecordsParam } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/record_operations";

class LeadManager {
    private recordOps: RecordOperations;

    constructor() {
        this.recordOps = new RecordOperations("Leads");
    }

    // Create lead
    async createLead(firstName: string, lastName: string, email: string, company: string): Promise<string | null> {
        let record = new Record();
        record.addKeyValue("First_Name", firstName);
        record.addKeyValue("Last_Name", lastName);
        record.addKeyValue("Email", email);
        record.addKeyValue("Company", company);

        let body = new BodyWrapper();
        body.setData([record]);

        let response = await this.recordOps.createRecords("Leads", body);

        if (response.getObject() instanceof ActionWrapper) {
            let actions = response.getObject().getData();
            for (let action of actions) {
                if (action instanceof SuccessResponse) {
                    return action.getDetails().get("id");
                }
            }
        }
        return null;
    }

    // Get all leads
    async getAllLeads(page: number = 1, perPage: number = 200): Promise<Record[]> {
        let params = new HeaderMap();
        params.add(GetRecordsParam.PAGE, page.toString());
        params.add(GetRecordsParam.PER_PAGE, perPage.toString());

        let response = await this.recordOps.getRecords(params, null);

        if (response.getObject() instanceof ResponseWrapper) {
            return response.getObject().getData();
        }
        return [];
    }

    // Get single lead
    async getLead(recordId: string): Promise<Record | null> {
        let response = await this.recordOps.getRecord(recordId, null, null);

        if (response.getObject() instanceof ResponseWrapper) {
            let records = response.getObject().getData();
            return records.length > 0 ? records[0] : null;
        }
        return null;
    }

    // Update lead
    async updateLead(recordId: string, updates: Map<string, any>): Promise<boolean> {
        let record = new Record();
        record.setId(BigInt(recordId));

        updates.forEach((value, key) => {
            record.addKeyValue(key, value);
        });

        let body = new BodyWrapper();
        body.setData([record]);

        let response = await this.recordOps.updateRecord(recordId, body);

        if (response.getObject() instanceof ActionWrapper) {
            let actions = response.getObject().getData();
            for (let action of actions) {
                if (action instanceof SuccessResponse) {
                    return true;
                }
            }
        }
        return false;
    }

    // Delete lead
    async deleteLead(recordId: string): Promise<boolean> {
        let response = await this.recordOps.deleteRecord(recordId);

        if (response.getObject() instanceof ActionWrapper) {
            let actions = response.getObject().getData();
            for (let action of actions) {
                if (action instanceof SuccessResponse) {
                    return true;
                }
            }
        }
        return false;
    }

    // Search leads
    async searchLeads(email: string): Promise<Record[]> {
        let params = new HeaderMap();
        params.add("email", email);

        let response = await this.recordOps.searchRecords("Leads", params);

        if (response.getObject() instanceof ResponseWrapper) {
            return response.getObject().getData();
        }
        return [];
    }
}

// Usage
async function main() {
    let manager = new LeadManager();

    // Create
    let newId = await manager.createLead("John", "Doe", "john@zoho.com", "Acme Inc");
    console.log("Created:", newId);

    // Search
    let results = await manager.searchLeads("john@zoho.com");
    console.log("Found:", results.length);

    // Update
    let updates = new Map();
    updates.set("Last_Name", "Smith");
    await manager.updateLead(newId, updates);

    // Delete
    await manager.deleteLead(newId);
    console.log("Deleted");
}

main();
```

---

## Modules Reference

### Available Operations Classes

| Module | Operations Class | Key Methods |
|--------|------------------|-------------|
| Attachments | `AttachmentsOperations` | getAttachments, uploadAttachments, deleteAttachments |
| Blueprint | `BluePrintOperations` | getBlueprint, updateBlueprint |
| Bulk Read | `BulkReadOperations` | createBulkReadJob, getBulkReadJobDetails |
| Bulk Write | `BulkWriteOperations` | uploadFile, createBulkWriteJob |
| Contact Roles | `ContactRolesOperations` | getContactRoles, createContactRoles |
| Currencies | `CurrenciesOperations` | getCurrencies, addCurrencies |
| Custom Views | `CustomViewsOperations` | getCustomViews, getCustomView |
| Fields | `FieldsOperations` | getFields, getField |
| Files | `FilesOperations` | uploadFiles, getFile |
| Layouts | `LayoutsOperations` | getLayouts, getLayout |
| Modules | `ModulesOperations` | getModules, getModule |
| Notes | `NotesOperations` | getNotes, createNotes |
| Notifications | `NotificationOperations` | enableNotifications, getNotificationDetails |
| Profiles | `ProfilesOperations` | getProfiles, getProfile |
| Records | `RecordOperations` | getRecord, createRecords, updateRecords |
| Related Records | `RelatedRecordsOperations` | getRelatedRecords, updateRelatedRecords |
| Roles | `RolesOperations` | getRoles, getRole |
| Tags | `TagsOperations` | getTags, createTags |
| Taxes | `TaxesOperations` | getTaxes, createTaxes |
| Territories | `TerritoryOperations` | getTerritories, getTerritory |
| Users | `UsersOperations` | getUsers, createUser, updateUser |
| Variables | `VariablesOperations` | getVariables, createVariables |

---

## Related Records Example

```typescript
import { RelatedRecordsOperations } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/related_records/related_records_operations";
import { ResponseWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/response_wrapper";

// Get notes for a lead
let relatedOps = new RelatedRecordsOperations("Notes", BigInt("123456789"), "Leads");

let response = await relatedOps.getRelatedRecords(null, null);

if (response.getObject() instanceof ResponseWrapper) {
    let notes = response.getObject().getData();
    notes.forEach(note => {
        console.log("Note Title:", note.getKeyValue("Note_Title"));
        console.log("Content:", note.getKeyValue("Note_Content"));
    });
}
```

---

## Attachments Example

```typescript
import { AttachmentsOperations } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/attachments/attachments_operations";
import { FileBodyWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/file_body_wrapper";
import { StreamWrapper } from "@zohocrm/typescript-sdk-2.0/utils/util/stream_wrapper";

// Upload attachment
let attachmentOps = new AttachmentsOperations("Leads", BigInt("123456789"));

let fileStream = new StreamWrapper(null, "test.txt", "text/plain");
let response = await attachmentOps.uploadAttachments(fileStream);

if (response.getObject() instanceof ActionWrapper) {
    console.log("Uploaded successfully");
}

// Download attachment
let downloadResponse = await attachmentOps.downloadAttachment("attachmentId");

if (downloadResponse.getObject() instanceof FileBodyWrapper) {
    let streamWrapper = downloadResponse.getObject().getFile();
    // Save to file
}
```

---

## Custom Views Example

```typescript
import { CustomViewsOperations } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/custom_views/custom_views_operations";
import { ResponseWrapper } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/custom_views/response_wrapper";

let cvOps = new CustomViewsOperations("Leads");

let response = await cvOps.getCustomViews(null);

if (response.getObject() instanceof ResponseWrapper) {
    let customViews = response.getObject().getData();

    customViews.forEach(cv => {
        console.log("ID:", cv.getId());
        console.log("Name:", cv.getName());
        console.log("Display Name:", cv.getDisplayName());
    });
}
```

---

## Error Handling Pattern

```typescript
import { APIException } from "@zohocrm/typescript-sdk-2.0/core/com/zoho/crm/api/record/api_exception";
import { SDKException } from "@zohocrm/typescript-sdk-2.0/routes/sdk_exception";

async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
    try {
        return await apiCall();
    } catch (error) {
        if (error instanceof SDKException) {
            console.error("SDK Error:", error.getMessage());
            console.error("Code:", error.getCode());
        } else if (error instanceof APIException) {
            console.error("API Error:", error.getMessage());
            console.error("Status:", error.getStatus());
            console.error("Code:", error.getCode());
        } else {
            console.error("Unexpected Error:", error);
        }
        return null;
    }
}

// Usage
let result = await safeApiCall(async () => {
    return await recordOps.getRecord("123456789", null, null);
});
```

---

## Environment Configuration

```typescript
// Production - US
USDataCenter.PRODUCTION()

// Developer - US
USDataCenter.DEVELOPER()

// Sandbox - US
USDataCenter.SANDBOX()

// Europe
EUDataCenter.PRODUCTION()

// India
INDataCenter.PRODUCTION()

// China
CNDataCenter.PRODUCTION()

// Australia
AUDataCenter.PRODUCTION()
```