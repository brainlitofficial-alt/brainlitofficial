# Vercel Deployment Instructions for BrainLit Admin Page

## Prerequisites
- GitHub repository connected to Vercel
- Supabase project set up with the required tables

## Step 1: Set Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variables:

### Required Environment Variables:

```
VITE_SUPABASE_URL
Value: https://prqznmxexaxsactbpeyn.supabase.co

VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycXpubXhleGF4c2FjdGJwZXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NjMzMDksImV4cCI6MjA4NjAzOTMwOX0.Fpx7473vfnoWL7UR3y52yAE-1fP-oj-QJpbQovHYzHQ

VITE_ADMIN_USERID
Value: Haja

VITE_ADMIN_PASSWORD
Value: Google@31
```

4. Make sure to select **Production**, **Preview**, and **Development** for each variable
5. Click **Save**

## Step 2: Set Up Supabase Tables

Run the following SQL scripts in your Supabase SQL Editor (in order):

### 1. Create registrations table:
```sql
-- Run the content from: supabase-setup.sql
```

### 2. Add unique constraints:
```sql
-- Run the content from: supabase-add-unique-constraints.sql
```

### 3. Fix admin access:
```sql
-- Run the content from: supabase-fix-admin-access.sql
```

### 4. Create webinar settings table:
```sql
-- Run the content from: supabase-webinar-settings.sql
```

## Step 3: Deploy to Vercel

### Option A: Automatic Deployment (Recommended)
1. Push your code to GitHub (already done)
2. Vercel will automatically detect and deploy

### Option B: Manual Deployment
1. In Vercel dashboard, click **Deployments**
2. Click **Redeploy** on the latest deployment
3. Check **Use existing Build Cache** (optional)
4. Click **Redeploy**

## Step 4: Verify Deployment

1. **Check the admin login page:**
   - Visit: `https://your-domain.vercel.app/admin/login`
   - Login with:
     - Username: `Haja`
     - Password: `Google@31`

2. **Test the admin dashboard:**
   - After login, you should be redirected to `/admin/dashboard`
   - Verify you can:
     - View registrations
     - Set/update webinar date
     - Export CSV

3. **Test the registration form:**
   - Visit: `https://your-domain.vercel.app/`
   - Verify the webinar date is displayed
   - Submit a test registration
   - Check that the webhook is triggered

## Step 5: Security Verification

### Protected Routes:
- `/admin` - Redirects to `/admin/login` if not authenticated
- `/admin/dashboard` - Redirects to `/admin/login` if not authenticated

### Session Management:
- Admin authentication is stored in `sessionStorage`
- Session clears when browser tab is closed
- Credentials are validated against environment variables

## Troubleshooting

### If admin page shows errors:
1. Check environment variables are set in Vercel
2. Redeploy after adding environment variables
3. Check browser console for specific errors

### If database operations fail:
1. Verify Supabase URL and Anon Key are correct
2. Check RLS policies are set up correctly
3. Run all SQL scripts in order

### If login fails:
1. Verify `VITE_ADMIN_USERID` and `VITE_ADMIN_PASSWORD` are set correctly
2. Check browser console for error messages
3. Clear browser cache and try again

### If webinar date doesn't show:
1. Run the `supabase-webinar-settings.sql` script
2. Check that the `webinar_settings` table has at least one row
3. Verify RLS policies allow public reads

## Important Security Notes

1. **Never commit `.env` file to GitHub** (it's already in `.gitignore`)
2. **Rotate credentials periodically** by updating environment variables in Vercel
3. **Keep Supabase keys secure** - never expose them in client-side code
4. **Use HTTPS only** - Vercel automatically provides SSL certificates

## Webhook Integration

The registration form sends data to:
`https://n8n.srv930949.hstgr.cloud/webhook/brainlit-bootcamp`

Payload includes:
- `parentName`
- `whatsapp`
- `email`
- `location`
- `registeredAt`
- `webinarDate` (newly added)

Make sure your n8n workflow is configured to receive the `webinarDate` field.

## Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console errors
4. Verify all environment variables are set correctly
