echo "postgresql://neondb_owner:npg_Hfez67IDSsbJ@ep-divine-cloud-aplfg2zs-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require" | npx vercel env add DATABASE_URL production
echo "postgresql://neondb_owner:npg_Hfez67IDSsbJ@ep-divine-cloud-aplfg2zs.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require" | npx vercel env add DIRECT_URL production
echo "ehr-bd-hackathon-jwt-secret-2026" | npx vercel env add JWT_SECRET production
echo "AIzaSyD3d0MGoxoD4-qZYNaoBxeTTP8lqfUedP8" | npx vercel env add GEMINI_API_KEY production
echo "http://localhost:5173,https://frontend-eta-three-38.vercel.app" | npx vercel env add FRONTEND_URL production
echo "production" | npx vercel env add NODE_ENV production
