# SkillForge API Documentation

## Overview
SkillForge provides comprehensive APIs for blockchain-verified learning management, NFT badge systems, and educational content delivery.

## Authentication
All API requests require authentication via JWT tokens or Hedera account verification.

```javascript
// Headers required for authenticated requests
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

## Core API Endpoints

### Learning Entries

#### GET /api/users/:userId/entries
Retrieve all learning entries for a specific user.

**Parameters:**
- `userId` (string): User identifier
- `category` (optional): Filter by category
- `limit` (optional): Number of entries to return
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "entry-123",
      "title": "React Hooks Mastery",
      "description": "Completed advanced React hooks tutorial",
      "category": "tutorial",
      "hederaTransactionId": "0.0.123456@1234567890.123456789",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "hasMore": true
}
```

#### POST /api/entries
Create a new learning entry and submit to Hedera blockchain.

**Request Body:**
```json
{
  "title": "Python Data Science Basics",
  "description": "Learned pandas and numpy fundamentals",
  "category": "course",
  "tags": ["python", "data-science", "pandas"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "entry-124",
    "hederaTransactionId": "0.0.123456@1234567890.123456790",
    "topicId": "0.0.789012",
    "status": "SUCCESS"
  }
}
```

### NFT Badges

#### GET /api/users/:userId/badges
Retrieve all badges for a specific user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "badge-1",
      "name": "First Steps",
      "description": "Recorded your first learning milestone",
      "rarity": "common",
      "unlocked": true,
      "hederaTokenId": "0.0.456789",
      "serialNumber": 1,
      "metadata": {
        "image": "https://skillforge.dev/badges/first-steps.png",
        "attributes": [
          {"trait_type": "Rarity", "value": "Common"},
          {"trait_type": "Milestone", "value": "1"}
        ]
      }
    }
  ]
}
```

#### POST /api/badges/claim
Claim an eligible badge and mint NFT.

**Request Body:**
```json
{
  "badgeId": "badge-2",
  "userAddress": "0x1234567890abcdef"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "0.0.456789@1234567890.123456791",
    "serialNumber": 2,
    "status": "SUCCESS"
  }
}
```

### Blockchain Verification

#### GET /api/hedera/verify/:transactionId
Verify a blockchain transaction on Hedera.

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "0.0.123456@1234567890.123456789",
    "status": "SUCCESS",
    "consensusTimestamp": "1234567890.123456789",
    "topicId": "0.0.789012",
    "message": {
      "title": "React Hooks Mastery",
      "userId": "user-123",
      "timestamp": 1234567890123
    },
    "hashscanUrl": "https://hashscan.io/testnet/transaction/0.0.123456@1234567890.123456789"
  }
}
```

## Hedera Integration APIs

### Consensus Service

#### POST /api/hedera/topics
Create a new Hedera topic for learning records.

**Request Body:**
```json
{
  "memo": "SkillForge Learning Records - User 123",
  "adminKey": "optional_admin_key"
}
```

#### POST /api/hedera/messages
Submit a message to a Hedera topic.

**Request Body:**
```json
{
  "topicId": "0.0.789012",
  "message": {
    "type": "learning_entry",
    "data": {
      "userId": "user-123",
      "title": "Advanced JavaScript",
      "category": "tutorial"
    }
  }
}
```

### Token Service

#### POST /api/hedera/tokens/nft
Create a new NFT token for badges.

**Request Body:**
```json
{
  "name": "SkillForge Achievement Badge",
  "symbol": "SFAB",
  "maxSupply": 1000000
}
```

#### POST /api/hedera/tokens/:tokenId/mint
Mint a new NFT badge.

**Request Body:**
```json
{
  "metadata": {
    "name": "Learning Master",
    "description": "Achieved 20 learning milestones",
    "image": "https://skillforge.dev/badges/learning-master.png"
  },
  "recipientAddress": "0x1234567890abcdef"
}
```

## WebSocket Events

### Real-time Notifications
Connect to `wss://api.skillforge.dev/ws` for real-time updates.

#### Events Emitted:
- `learning_entry_created`: New learning entry added
- `badge_unlocked`: New badge available for claiming
- `badge_claimed`: Badge successfully claimed and minted
- `verification_complete`: Blockchain verification completed

#### Example Event:
```json
{
  "event": "badge_unlocked",
  "data": {
    "userId": "user-123",
    "badgeId": "badge-5",
    "name": "Knowledge Builder",
    "milestone": 10
  }
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": {
      "field": "title",
      "value": ""
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `HEDERA_ERROR`: Blockchain transaction failed
- `RATE_LIMIT_ERROR`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- 10 blockchain transactions per minute per user

## SDK Usage Examples

### JavaScript SDK
```javascript
import { SkillForgeSDK } from '@skillforge/sdk'

const sdk = new SkillForgeSDK({
  apiKey: 'your-api-key',
  environment: 'production'
})

// Create learning entry
const entry = await sdk.entries.create({
  title: 'Node.js Fundamentals',
  description: 'Completed Node.js basics course',
  category: 'course'
})

// Claim badge
const badge = await sdk.badges.claim('badge-3')

// Verify transaction
const verification = await sdk.hedera.verify(entry.hederaTransactionId)
```

### Python SDK
```python
from skillforge import SkillForgeClient

client = SkillForgeClient(api_key='your-api-key')

# Create learning entry
entry = client.entries.create(
    title='Machine Learning Basics',
    description='Completed ML fundamentals',
    category='course'
)

# Get user badges
badges = client.badges.get_user_badges('user-123')
```

## Webhook Integration

### Setup Webhooks
Configure webhooks to receive real-time notifications about user activities.

**Webhook URL Configuration:**
```json
{
  "url": "https://your-app.com/webhooks/skillforge",
  "events": ["learning_entry_created", "badge_unlocked"],
  "secret": "your-webhook-secret"
}
```

**Webhook Payload Example:**
```json
{
  "event": "learning_entry_created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "userId": "user-123",
    "entryId": "entry-456",
    "title": "React Advanced Patterns",
    "hederaTransactionId": "0.0.123456@1234567890.123456789"
  },
  "signature": "sha256=abc123..."
}
```