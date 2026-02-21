# Database Connections & AI Data Queries

SmartChat can connect to your business databases and let the AI answer questions about your data using natural language.

## How It Works

```
User: "How many orders did we have last month?"
      ↓
AI generates SQL: SELECT COUNT(*) FROM orders 
                  WHERE created_at >= '2026-01-01'
      ↓
Query executes against your database
      ↓
AI: "You had 1,247 orders last month."
```

## Supported Databases

| Database | Status | Notes |
|----------|--------|-------|
| PostgreSQL | ✅ Full support | Best tested |
| MySQL | ✅ Full support | Via aiomysql |
| MongoDB | ✅ Full support | Via motor (async) |

## Setup

### 1. Add a Connection (Admin Panel)

Go to **Admin → DB Connections → Add Connection**

Fill in:
- **Name**: Human-readable name (e.g., "Production Orders DB")
- **Description**: What data is here (helps the AI understand context)
- **Database Type**: postgresql / mysql / mongodb

#### SQL / MySQL / PostgreSQL
- **Host/Port**: Database server location
- **Database**: Database name
- **Username/Password**: Credentials

#### MongoDB
You can connect using either:

**Option A — Full connection string (recommended)**
- **Connection String**: e.g.
  ```
  mongodb://user:pass@host:27017/dbname?authSource=dbname&retryWrites=true
  ```

**Option B — Individual fields**
- **Host/Port/Database/Username/Password**

> Tip: For replica sets that advertise internal hostnames, SmartChat adds `directConnection=true` automatically to improve connectivity.

### 2. Test the Connection

Click **Test** to verify connectivity.

### 3. Fetch Schema

Click **Schema** to auto-discover tables/columns. This helps the AI write correct queries.

### 4. Chat!

Now users can ask questions like:
- "How many customers signed up this week?"
- "What's our top-selling product?"
- "Show me orders over $1000 from California"

## Security

### Safety Features

1. **SELECT Only**: For SQL databases, only SELECT queries are allowed. No INSERT/UPDATE/DELETE.

2. **Read-Only User**: We recommend creating a read-only database user:

   ```sql
   -- PostgreSQL
   CREATE USER smartchat_reader WITH PASSWORD 'secure_password';
   GRANT CONNECT ON DATABASE mydb TO smartchat_reader;
   GRANT USAGE ON SCHEMA public TO smartchat_reader;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO smartchat_reader;
   ```

   ```sql
   -- MySQL
   CREATE USER 'smartchat_reader'@'%' IDENTIFIED BY 'secure_password';
   GRANT SELECT ON mydb.* TO 'smartchat_reader'@'%';
   ```

3. **Row Limits**: Results are limited to 50 rows to prevent token overflow.

4. **Sandboxed**: Each query runs in isolation, no session state.

### Best Practices

- Use a **read-only database user**
- Consider a **read replica** for production
- Set up **network isolation** (VPC, firewall rules)
- Review query logs periodically
- Limit accessible tables/schemas if needed

## Configuration via .env

Currently, DB connections are managed via the **Admin Panel** and stored in SmartChat's Postgres database.

> If you want to support provisioning DB connections via `.env`, we can add a startup seeder, but it’s not implemented in the current code.

## Schema Information

The schema info is crucial for accurate queries. It tells the AI:
- What tables exist
- What columns are in each table
- Data types

You can:
1. **Auto-fetch**: Click "Fetch Schema" in the admin panel
2. **Manual entry**: Provide custom schema documentation

Example manual schema (for sensitive environments):

```
Table: orders
  - id (integer, primary key)
  - customer_id (integer, FK to customers)
  - total_amount (decimal)
  - status (enum: pending, shipped, delivered)
  - created_at (timestamp)

Table: customers
  - id (integer, primary key)
  - name (varchar)
  - email (varchar)
  - region (varchar)
```

## MongoDB Queries

For MongoDB, queries use a JSON format:

```json
{
  "collection": "orders",
  "operation": "find",
  "filter": {"status": "active"},
  "projection": {"customer": 1, "total": 1},
  "limit": 10
}
```

Supported operations:
- `find` - Query documents
- `aggregate` - Run aggregation pipelines
- `count` - Count matching documents

## Custom Tools

Beyond general queries, you can create **custom tools** with predefined queries:

```json
{
  "name": "get_top_customers",
  "description": "Get top N customers by order value",
  "tool_type": "db_query",
  "db_connection_id": "uuid-here",
  "config_json": {
    "query_template": "SELECT customer_name, SUM(total) as total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC LIMIT {limit}",
    "parameters": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "integer",
          "description": "Number of top customers to return"
        }
      },
      "required": ["limit"]
    }
  }
}
```

## Troubleshooting

### "Connection refused"
- Check host/port are correct
- Verify firewall allows the connection
- Ensure database server is running

### "Authentication failed"
- Verify username/password
- Check user has CONNECT privilege
- For PostgreSQL, check pg_hba.conf

### "Permission denied"
- Grant SELECT on required tables
- Check schema permissions

### "Schema not fetching"
- User needs access to information_schema
- For MongoDB, needs listCollections permission

## API Endpoints

```
GET    /api/admin/db-connections          # List all connections
POST   /api/admin/db-connections          # Create connection
PUT    /api/admin/db-connections/{id}     # Update connection
DELETE /api/admin/db-connections/{id}     # Delete connection
POST   /api/admin/db-connections/{id}/test         # Test connection
POST   /api/admin/db-connections/{id}/fetch-schema # Fetch schema
```

## Example: E-commerce Setup

```bash
# Add your production database
curl -X POST http://localhost:8000/api/admin/db-connections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Production",
    "description": "Orders, customers, products, inventory. Use for sales analytics and customer insights.",
    "db_type": "postgresql",
    "host": "prod-db.internal",
    "port": 5432,
    "database": "ecommerce",
    "username": "smartchat_reader",
    "password": "secure_password"
  }'

# Fetch schema
curl -X POST http://localhost:8000/api/admin/db-connections/{id}/fetch-schema

# Now users can ask:
# - "What were our total sales last quarter?"
# - "Which products are low on inventory?"
# - "Show me customers who haven't ordered in 90 days"
```
