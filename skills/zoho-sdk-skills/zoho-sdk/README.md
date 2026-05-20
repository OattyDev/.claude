# Zoho CRM TypeScript SDK v2 Documentation

Comprehensive documentation for Zoho CRM TypeScript SDK v2.

## Structure

```
zoho-sdk/
├── README.md                    # This file
├── docs/
│   ├── 01-configuration.md      # SDK configuration guide
│   ├── 02-initialization.md     # SDK initialization
│   ├── 03-persistence.md       # Token persistence options
│   ├── 04-class-hierarchy.md    # Class hierarchy & structure
│   ├── 05-multiuser.md          # Multi-user configuration
│   ├── 06-responses.md          # Response handling
│   ├── 07-records.md            # Record operations (CRUD)
│   └── 08-sample-codes.md       # Sample code reference
```

## Quick Start

```typescript
import { InitializeBuilder } from "@zohocrm/typescript-sdk-2.0/routes/initialize_builder";
import { UserSignature } from "@zohocrm/typescript-sdk-2.0/routes/user_signature";
import { USDataCenter } from "@zohocrm/typescript-sdk-2.0/routes/dc/us_data_center";
import { OAuthBuilder } from "@zohocrm/typescript-sdk-2.0/models/authenticator/oauth_builder";
import { DBBuilder } from "@zohocrm/typescript-sdk-2.0/models/authenticator/store/db_builder";
import { SDKConfigBuilder } from "@zohocrm/typescript-sdk-2.0/routes/sdk_config_builder";

await new InitializeBuilder()
    .user(new UserSignature("user@zoho.com"))
    .environment(USDataCenter.PRODUCTION())
    .token(new OAuthBuilder()
        .clientId("clientId")
        .clientSecret("clientSecret")
        .refreshToken("refreshToken")
        .redirectURL("redirectURL")
        .build())
    .store(new DBBuilder().host("localhost").databaseName("zohooauth").build())
    .SDKConfig(new SDKConfigBuilder().pickListValidation(false).autoRefreshFields(true).build())
    .resourcePath("/path/to/resources")
    .initialize();
```

## Available Documentation

| Document | Description |
|----------|-------------|
| [Configuration](docs/01-configuration.md) | SDK setup and configuration options |
| [Initialization](docs/02-initialization.md) | Application initialization process |
| [Persistence](docs/03-persistence.md) | Token storage (DB, File, Custom) |
| [Class Hierarchy](docs/04-class-hierarchy.md) | SDK architecture and class structure |
| [Multi-User](docs/05-multiuser.md) | Multi-user authentication setup |
| [Responses](docs/06-responses.md) | Response handling and error processing |
| [Records](docs/07-records.md) | Record CRUD operations |
| [Sample Codes](docs/08-sample-codes.md) | Complete code examples |

## Data Centers

- `USDataCenter` - United States
- `EUDataCenter` - Europe
- `INDataCenter` - India
- `CNDataCenter` - China
- `AUDataCenter` - Australia

## Environments

- `PRODUCTION()` - Live production environment
- `DEVELOPER()` - Developer sandbox
- `SANDBOX()` - Testing sandbox

## Installation

```bash
npm install @zohocrm/typescript-sdk-2.0
```

**Requirements:** Node.js 9+ and npm