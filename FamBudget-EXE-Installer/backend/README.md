# FamBudget Backend API

NestJS-based REST API for FamBudget family budgeting application.

## Tech Stack

- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator
- **Security**: bcrypt for password hashing, AES-256 for data encryption

## Project Structure

```
backend/
├── src/
│   ├── entities/           # TypeORM entities (database models)
│   │   ├── household.entity.ts
│   │   ├── member.entity.ts
│   │   ├── account.entity.ts
│   │   ├── income.entity.ts
│   │   ├── envelope.entity.ts
│   │   ├── transaction.entity.ts
│   │   ├── goal.entity.ts
│   │   └── split-rule.entity.ts
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication & authorization
│   │   ├── household/     # Household management
│   │   ├── envelope/      # Budget envelopes
│   │   ├── transaction/   # Transaction tracking
│   │   ├── goal/          # Savings goals
│   │   ├── split-rule/    # Split rules engine
│   │   └── report/        # Reports & analytics
│   ├── common/            # Shared utilities
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── .env.example           # Environment variables template
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user & household | No |
| POST | `/auth/login` | Login user | No |

### Household

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/household` | Get household details | Yes |
| GET | `/household/dashboard` | Get dashboard data | Yes |
| GET | `/household/members` | List household members | Yes |
| PATCH | `/household` | Update household | Yes |

### Envelopes (Budget Categories)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/envelopes` | List all envelopes | Yes |
| POST | `/envelopes` | Create envelope | Yes |
| POST | `/envelopes/defaults` | Create default envelopes | Yes |
| PATCH | `/envelopes/:id` | Update envelope | Yes |
| DELETE | `/envelopes/:id` | Delete envelope | Yes |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/transactions` | List transactions | Yes |
| POST | `/transactions` | Create transaction | Yes |
| DELETE | `/transactions/:id` | Delete transaction | Yes |
| GET | `/transactions/report/monthly` | Monthly report | Yes |

## Database Schema

### Relationships

- Household has many Members, Accounts, Envelopes, Transactions, Goals, SplitRules
- Member belongs to Household, has many Incomes and Transactions
- Account belongs to Household, has many Transactions
- Transaction belongs to Household, Account, Member (payer), SplitRule
- Envelope belongs to Household
- Goal belongs to Household
- SplitRule belongs to Household

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=fambudget

JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

PORT=3000
NODE_ENV=development

ENCRYPTION_KEY=your-encryption-key
```

### Running

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start
```

### Database Migrations

```bash
# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: class-validator on all DTOs
- **Role-Based Access**: Different permissions per member role
- **Data Encryption**: Sensitive financial data encrypted at rest

## Error Handling

All errors follow consistent format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "timestamp": "2025-10-01T12:00:00.000Z"
}
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

MIT

