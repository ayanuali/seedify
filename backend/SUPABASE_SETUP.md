# Supabase Database Setup

## Step 1: Access SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project (cdzdrlldltfijpfdaqkf)
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"

## Step 2: Run Schema

1. Copy all contents from `schema.sql`
2. Paste into the SQL Editor
3. Click "Run" or press Cmd+Enter
4. You should see success messages for each table created

## Step 3: Verify Tables

1. Click "Table Editor" in left sidebar
2. You should see 3 tables:
   - `jobs` - stores all freelance jobs
   - `users` - user profiles and stats
   - `reviews` - feedback and ratings

## Done!

Your database is ready. The backend API will automatically use these tables.
