-- CreateTable
CREATE TABLE "users_detail" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "profile_photo" TEXT,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "users_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_detail_user_id_key" ON "users_detail"("user_id");

-- AddForeignKey
ALTER TABLE "users_detail" ADD CONSTRAINT "users_detail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
