-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';
