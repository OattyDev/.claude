# Multi-User - Zoho CRM TypeScript SDK v2

## Overview

The SDK supports multiple CRM users through user switching functionality.

```mermaid
graph TD
    A[SDK Initialization] --> B[User 1 Configured]
    B --> C[API Calls as User 1]
    C --> D[switchUser to User 2]
    D --> E[User 2 Configured]
    E --> F[API Calls as User 2]
    F --> G[removeUserConfiguration]
    G --> H[User 1 Still Available]
```

---

## User Switching

### Switch User Configuration

```typescript
import { Initializer } from "@zohocrm/typescript-sdk-2.0/routes/initializer";
import { UserSignature } from "@zohocrm/typescript-sdk-2.0/routes/user_signature";
import { Environment } from "@zohocrm/typescript-sdk-2.0/routes/dc/environment";
import { USDataCenter } from "@zohocrm/typescript-sdk-2.0/routes/dc/us_data_center";
import { OAuthToken } from "@zohocrm/typescript-sdk-2.0/models/authenticator/oauth_token";
import { SDKConfig } from "@zohocrm/typescript-sdk-2.0/routes/sdk_config";

let environment: Environment = USDataCenter.PRODUCTION();

let newUser: UserSignature = new UserSignature("user2@zoho.com");

let newToken: OAuthToken = new OAuthBuilder()
    .clientId("clientId")
    .clientSecret("clientSecret")
    .refreshToken("refreshToken")
    .redirectURL("redirectURL")
    .build();

let newSdkConfig: SDKConfig = new SDKConfigBuilder()
    .pickListValidation(false)
    .autoRefreshFields(true)
    .build();

Initializer.getInitializer().switchUser(newUser, environment, newToken, newSdkConfig);
```

---

## Remove User Configuration

```typescript
let user: UserSignature = new UserSignature("user2@zoho.com");
let environment: Environment = USDataCenter.PRODUCTION();
let token: OAuthToken = new OAuthToken();

Initializer.getInitializer().removeUserConfiguration(user, environment, token);
```

---

## Multi-User Architecture

```mermaid
sequenceDiagram
    participant App
    participant SDK
    participant Store

    App->>SDK: initialize(user1, env, token1)
    SDK->>Store: saveToken(user1, token1)
    Store-->>SDK: saved

    App->>SDK: switchUser(user2, env, token2)
    SDK->>Store: saveToken(user2, token2)
    Store-->>SDK: saved

    App->>SDK: getToken(user1)
    SDK->>Store: retrieve token1
    Store-->>SDK: token1

    App->>SDK: removeUserConfiguration(user2)
    SDK->>Store: deleteToken(user2)
    Store-->>SDK: deleted
```

---

## Implementation Pattern

### Managing Multiple Users

```typescript
class ZohoMultiUserManager {
    private users: Map<string, UserConfig> = new Map();

    addUser(email: string, clientId: string, clientSecret: string,
            refreshToken: string, redirectURL: string) {
        let user = new UserSignature(email);
        let token = new OAuthBuilder()
            .clientId(clientId)
            .clientSecret(clientSecret)
            .refreshToken(refreshToken)
            .redirectURL(redirectURL)
            .build();

        this.users.set(email, { user, token });
    }

    switchToUser(email: string) {
        let config = this.users.get(email);
        if (config) {
            Initializer.getInitializer().switchUser(
                config.user,
                USDataCenter.PRODUCTION(),
                config.token,
                new SDKConfigBuilder().build()
            );
        }
    }

    getActiveUser(): UserSignature {
        return Initializer.getInitializer().getUser();
    }
}
```

---

## Token Persistence for Multi-User

Each user requires their own token storage entry:

| User | Token ID | Storage |
|------|----------|---------|
| user1@zoho.com | user1_token | DB/File |
| user2@zoho.com | user2_token | DB/File |

**Important:** UserMail + Environment uniquely identifies a user configuration.

---

## Environment Considerations

When using multiple environments (Production, Developer, Sandbox):

```typescript
// Production user
USDataCenter.PRODUCTION()

// Developer user
USDataCenter.DEVELOPER()

// Sandbox user
USDataCenter.SANDBOX()
```

**Note:** Tokens from different environments/domains are NOT interchangeable. The SDK throws an error if mismatched.